import { describe, it, expect } from "vitest";
import { suggestAlternatives } from "./alternatives";
import { getProductBySlug } from "./products";

describe("suggestAlternatives", () => {
  it("suggests a cleaner alternative in the same category", () => {
    const socks = getProductBySlug("wool-socks")!;
    const alternatives = suggestAlternatives(socks);
    expect(alternatives.every((p) => p.category === socks.category)).toBe(true);
    expect(alternatives.length).toBeGreaterThan(0);
  });

  it("never suggests the product itself", () => {
    const socks = getProductBySlug("wool-socks")!;
    const alternatives = suggestAlternatives(socks);
    expect(alternatives.find((p) => p.id === socks.id)).toBeUndefined();
  });

  it("returns nothing for an already-perfect product", () => {
    const bottle = getProductBySlug("stainless-steel-water-bottle")!;
    expect(suggestAlternatives(bottle)).toEqual([]);
  });
});
