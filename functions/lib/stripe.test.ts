import { describe, it, expect } from "vitest";
import { verifyStripeSignature } from "./stripe";
import { toHex } from "./crypto";

const SECRET = "whsec_test_secret";
const BODY = JSON.stringify({
  type: "checkout.session.completed",
  data: { object: { id: "cs_test_123" } },
});

/** Independently reproduces Stripe's documented `t=...,v1=...` scheme. */
async function sign(body: string, secret: string, timestamp: number): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${body}`)
  );
  return `t=${timestamp},v1=${toHex(new Uint8Array(mac))}`;
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

describe("verifyStripeSignature", () => {
  it("accepts a correctly signed, fresh payload", async () => {
    const header = await sign(BODY, SECRET, nowSeconds());
    expect(await verifyStripeSignature(BODY, header, SECRET)).toBe(true);
  });

  it("rejects a signature made with a different secret", async () => {
    const header = await sign(BODY, "whsec_attacker_secret", nowSeconds());
    expect(await verifyStripeSignature(BODY, header, SECRET)).toBe(false);
  });

  it("rejects a tampered body that keeps a previously valid signature", async () => {
    const header = await sign(BODY, SECRET, nowSeconds());
    const tampered = BODY.replace("cs_test_123", "cs_test_attacker");
    expect(await verifyStripeSignature(tampered, header, SECRET)).toBe(false);
  });

  it("rejects a replayed payload older than the tolerance window", async () => {
    // Correctly signed, but for a timestamp well outside the window.
    const header = await sign(BODY, SECRET, nowSeconds() - 10_000);
    expect(await verifyStripeSignature(BODY, header, SECRET)).toBe(false);
  });

  it("accepts a payload inside the tolerance window", async () => {
    const header = await sign(BODY, SECRET, nowSeconds() - 60);
    expect(await verifyStripeSignature(BODY, header, SECRET)).toBe(true);
  });

  it("rejects a timestamp reused with a signature for a different timestamp", async () => {
    const real = await sign(BODY, SECRET, nowSeconds() - 60);
    const signature = real.split("v1=")[1];
    // Same signature, but claiming a different timestamp: the HMAC covers
    // the timestamp, so this must not verify.
    const forged = `t=${nowSeconds()},v1=${signature}`;
    expect(await verifyStripeSignature(BODY, forged, SECRET)).toBe(false);
  });

  it("rejects malformed headers instead of throwing", async () => {
    for (const bad of [
      "",
      "garbage",
      "t=,v1=",
      `t=${nowSeconds()}`, // no v1
      "v1=abc123", // no timestamp
      `t=not-a-number,v1=abc123`,
      `t=${nowSeconds()},v1=nothexadecimal!!`,
      `t=${nowSeconds()},v1=`,
    ]) {
      expect(await verifyStripeSignature(BODY, bad, SECRET)).toBe(false);
    }
  });
});
