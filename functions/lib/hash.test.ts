import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./hash";

describe("hashPassword / verifyPassword", () => {
  it("accepts the correct password", async () => {
    const stored = await hashPassword("correcthorsebatterystaple");
    expect(await verifyPassword("correcthorsebatterystaple", stored)).toBe(true);
  });

  it("rejects the wrong password", async () => {
    const stored = await hashPassword("correcthorsebatterystaple");
    expect(await verifyPassword("Correcthorsebatterystaple", stored)).toBe(false);
    expect(await verifyPassword("", stored)).toBe(false);
  });

  it("salts each hash, so the same password never stores the same digest", async () => {
    const a = await hashPassword("same-password");
    const b = await hashPassword("same-password");
    expect(a).not.toBe(b);
    // ...but both still verify.
    expect(await verifyPassword("same-password", a)).toBe(true);
    expect(await verifyPassword("same-password", b)).toBe(true);
  });

  it("records the algorithm and iteration count so they can be upgraded later", async () => {
    const stored = await hashPassword("whatever");
    const [scheme, iterations] = stored.split("$");
    expect(scheme).toBe("pbkdf2-sha256");
    expect(Number(iterations)).toBeGreaterThanOrEqual(210_000);
  });

  it("verifies against the iteration count stored with the hash, not the current default", async () => {
    // Simulates a hash written before the cost was raised: the stored record
    // says 1000 rounds, so verification must use 1000 rounds too.
    const stored = await hashPassword("legacy-password");
    const [, , salt, digest] = stored.split("$");
    const rewritten = `pbkdf2-sha256$1000$${salt}$${digest}`;
    // The digest was computed at the higher cost, so the lower-cost check
    // must fail rather than silently pass.
    expect(await verifyPassword("legacy-password", rewritten)).toBe(false);
  });

  it("rejects malformed stored hashes instead of throwing", async () => {
    for (const bad of [
      "",
      "not-a-hash",
      "pbkdf2-sha256$210000$onlythreeparts",
      "bcrypt$210000$c2FsdA==$aGFzaA==",
      "pbkdf2-sha256$notanumber$c2FsdA==$aGFzaA==",
      "pbkdf2-sha256$-1$c2FsdA==$aGFzaA==",
    ]) {
      expect(await verifyPassword("password", bad)).toBe(false);
    }
  });
});
