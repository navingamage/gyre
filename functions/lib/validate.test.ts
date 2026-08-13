import { describe, it, expect } from "vitest";
import { isValidEmail, isValidPassword } from "./validate";

describe("isValidEmail", () => {
  it("accepts ordinary addresses", () => {
    for (const email of ["a@b.co", "navin@example.com", "first.last+tag@sub.example.org"]) {
      expect(isValidEmail(email)).toBe(true);
    }
  });

  it("rejects addresses missing structure", () => {
    for (const email of ["", "no-at-sign", "@example.com", "user@", "user@host", "a b@example.com"]) {
      expect(isValidEmail(email)).toBe(false);
    }
  });

  it("rejects non-strings", () => {
    for (const value of [null, undefined, 42, {}, ["a@b.co"]]) {
      expect(isValidEmail(value)).toBe(false);
    }
  });

  it("rejects addresses beyond the maximum length", () => {
    expect(isValidEmail(`${"a".repeat(250)}@example.com`)).toBe(false);
  });
});

describe("isValidPassword", () => {
  it("accepts passwords at or above the minimum length", () => {
    expect(isValidPassword("12345678")).toBe(true);
    expect(isValidPassword("a much longer passphrase")).toBe(true);
  });

  it("rejects passwords below the minimum length", () => {
    expect(isValidPassword("")).toBe(false);
    expect(isValidPassword("1234567")).toBe(false);
  });

  it("rejects absurdly long passwords, which would only burn CPU in PBKDF2", () => {
    expect(isValidPassword("a".repeat(201))).toBe(false);
  });

  it("rejects non-strings", () => {
    for (const value of [null, undefined, 12345678, {}]) {
      expect(isValidPassword(value)).toBe(false);
    }
  });
});
