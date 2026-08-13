import type { Env } from "../../lib/env";
import { verifyStripeSignature } from "../../lib/stripe";
import { markOrderPaidByStripeSession } from "../../lib/orders";

interface StripeEvent {
  type: string;
  data: { object: { id: string } };
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return Response.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const signatureHeader = request.headers.get("Stripe-Signature");
  if (!signatureHeader) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  // Signature verification needs the exact raw bytes Stripe signed, so the
  // body is read as text before any JSON parsing.
  const rawBody = await request.text();
  const valid = await verifyStripeSignature(rawBody, signatureHeader, env.STRIPE_WEBHOOK_SECRET);
  if (!valid) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody) as StripeEvent;

  if (event.type === "checkout.session.completed") {
    await markOrderPaidByStripeSession(env.DB, event.data.object.id);
  }

  return Response.json({ received: true });
};
