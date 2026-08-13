import type { Env } from "../lib/env";
import { getCurrentUser } from "../lib/auth";
import { getProductsByIds } from "../lib/products";
import { attachStripeSession, createPendingOrder } from "../lib/orders";
import { createCheckoutSession } from "../lib/stripe";

interface RequestedItem {
  productId: string;
  quantity: number;
}

const MAX_QUANTITY_PER_ITEM = 99;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const user = await getCurrentUser(request, env.DB);
  if (!user) {
    return Response.json({ error: "Sign in to check out" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const items = (body as { items?: unknown }).items;
  if (!Array.isArray(items) || items.length === 0) {
    return Response.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Merge duplicate product IDs and validate quantities before ever
  // touching prices.
  const requestedQuantities = new Map<string, number>();
  for (const raw of items as RequestedItem[]) {
    if (
      typeof raw !== "object" ||
      raw === null ||
      typeof raw.productId !== "string" ||
      !Number.isInteger(raw.quantity) ||
      raw.quantity < 1 ||
      raw.quantity > MAX_QUANTITY_PER_ITEM
    ) {
      return Response.json({ error: "Invalid cart item" }, { status: 400 });
    }
    requestedQuantities.set(raw.productId, (requestedQuantities.get(raw.productId) ?? 0) + raw.quantity);
  }

  // Prices always come from the database — the client's cart is never
  // trusted for money, only for which product IDs and quantities to buy.
  const productIds = [...requestedQuantities.keys()];
  const products = await getProductsByIds(env.DB, productIds);
  if (products.length !== productIds.length) {
    return Response.json({ error: "One or more products no longer exist" }, { status: 400 });
  }

  if (!env.STRIPE_SECRET_KEY) {
    return Response.json(
      { error: "Checkout isn't configured yet (missing STRIPE_SECRET_KEY)." },
      { status: 500 }
    );
  }

  const orderItems = products.map((product) => ({
    productId: product.id,
    quantity: requestedQuantities.get(product.id)!,
    unitPriceCents: Math.round(product.price * 100),
  }));

  const orderId = await createPendingOrder(env.DB, user.id, orderItems);

  const origin = new URL(request.url).origin;
  let session;
  try {
    session = await createCheckoutSession({
      secretKey: env.STRIPE_SECRET_KEY,
      lineItems: products.map((product) => ({
        name: product.name,
        unitAmountCents: Math.round(product.price * 100),
        quantity: requestedQuantities.get(product.id)!,
      })),
      successUrl: `${origin}/order/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/cart`,
      customerEmail: user.email,
      metadata: { orderId },
    });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Failed to start checkout" },
      { status: 502 }
    );
  }

  await attachStripeSession(env.DB, orderId, session.id);

  return Response.json({ url: session.url });
};
