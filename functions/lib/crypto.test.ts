import { describe, it, expect } from "vitest";
import { fromBase64, fromHex, sha256Hex, timingSafeEqual, toBase64, toHex } from "./crypto";

describe("timingSafeEqual", () => {
  it("is true only for identical byte sequences", () => {
    expect(timingSafeEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]))).toBe(true);
    expect(timingSafeEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4]))).toBe(false);
  });

  it("is false for different lengths rather than throwing", () => {
    expect(timingSafeEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2, 3]))).toBe(false);
  });

  it("compares every byte, not just the first difference", () => {
    // Differing only in the final byte must still be rejected.
    const a = new Uint8Array(32).fill(7);
    const b = new Uint8Array(32).fill(7);
    b[31] = 8;
    expect(timingSafeEqual(a, b)).toBe(false);
  });

  it("treats empty sequences as equal", () => {
    expect(timingSafeEqual(new Uint8Array(), new Uint8Array())).toBe(true);
  });
});

describe("encoding round-trips", () => {
  it("round-trips arbitrary bytes through base64", () => {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    expect(fromBase64(toBase64(bytes))).toEqual(bytes);
  });

  it("round-trips arbitrary bytes through hex", () => {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    expect(fromHex(toHex(bytes))).toEqual(bytes);
  });

  it("pads single-digit bytes in hex output", () => {
    expect(toHex(new Uint8Array([0, 1, 15, 16, 255]))).toBe("00010f10ff");
  });
});

describe("sha256Hex", () => {
  it("matches the known digest of the empty string", async () => {
    expect(await sha256Hex("")).toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    );
  });

  it("is deterministic and differs for different inputs", async () => {
    expect(await sha256Hex("token-a")).toBe(await sha256Hex("token-a"));
    expect(await sha256Hex("token-a")).not.toBe(await sha256Hex("token-b"));
  });
});
