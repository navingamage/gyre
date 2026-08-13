import { fromHex, timingSafeEqual } from "./crypto";

function flatten(value: unknown, prefix: string, out: [string, string][]): void {
  if (value === null || value === undefined) return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => flatten(item, `${prefix}[${index}]`, out));
  } else if (typeof value === "object") {
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      flatten(v, prefix ? `${prefix}[${key}]` : key, out);
    }
  } else {
    out.push([prefix, String(value)]);
  }
}

function toStripeForm(params: Record<string, unknown>): URLSearchParams {
  const pairs: [string, string][] = [];
  flatten(params, "", pairs);
  const search = new URLSearchParams();
  for (const [key, value] of pairs) search.append(key, value);
  return search;
}

export interface CheckoutLineItem {
  name: string;
  unitAmountCents: number;
  quantity: number;
}

export interface CheckoutSession {
  id: string;
  url: string;
}

export async function createCheckoutSession(opts: {
  secretKey: string;
  lineItems: CheckoutLineItem[];
  successUrl: string;
  cancelUrl: string;
  customerEmail: string;
  metadata: Record<string, string>;
}): Promise<CheckoutSession> {
  const body = toStripeForm({
    mode: "payment",
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    customer_email: opts.customerEmail,
    metadata: opts.metadata,
    shipping_address_collection: { allowed_countries: ["US"] },
    line_items: opts.lineItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: item.unitAmountCents,
        product_data: { name: item.name },
      },
    })),
  });

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Stripe checkout session creation failed (${res.status}): ${detail}`);
  }

  return res.json();
}

/**
 * Verifies Stripe's webhook signature scheme: the `Stripe-Signature` header
 * carries `t=<timestamp>,v1=<hmac>`, where the HMAC is computed over
 * `${timestamp}.${rawBody}` using the webhook signing secret. See
 * https://docs.stripe.com/webhooks#verify-manually
 */
export async function verifyStripeSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string,
  toleranceSeconds = 300
): Promise<boolean> {
  const parts = new Map(
    signatureHeader.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key, value] as [string, string];
    })
  );
  const timestamp = parts.get("t");
  const signature = parts.get("v1");
  if (!timestamp || !signature) return false;

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(ageSeconds) || ageSeconds > toleranceSeconds) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const expected = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${rawBody}`)
  );

  try {
    return timingSafeEqual(new Uint8Array(expected), fromHex(signature));
  } catch {
    return false;
  }
}
