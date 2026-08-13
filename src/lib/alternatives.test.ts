import { describe, it, expect } from "vitest";
import { suggestAlternatives } from "./alternatives";
import type { Product } from "../types";

function makeProduct(overrides: Partial<Product>): Product {
  return {
    id: "x",
    slug: "x",
    name: "Test product",
    brand: "Test",
    category: "clothing",
    price: 10,
    materials: [],
    synthetics: [],
    packaging: "plastic-free",
    description: "",
    ...overrides,
  };
}

const socks = makeProduct({
  id: "socks",
  slug: "wool-socks",
  category: "clothing",
  synthetics: ["elastane"],
});
const tee = makeProduct({ id: "tee", slug: "organic-cotton-tee", category: "clothing" });
const bottle = makeProduct({ id: "bottle", slug: "steel-bottle", category: "kitchen" });

const catalog = [socks, tee, bottle];

describe("suggestAlternatives", () => {
  it("suggests a cleaner alternative in the same category", () => {
    const alternatives = suggestAlternatives(socks, catalog);
    expect(alternatives.every((p) => p.category === socks.category)).toBe(true);
    expect(alternatives).toEqual([tee]);
  });

  it("never suggests the product itself", () => {
    const alternatives = suggestAlternatives(socks, catalog);
    expect(alternatives.find((p) => p.id === socks.id)).toBeUndefined();
  });

  it("returns nothing for an already-perfect product", () => {
    expect(suggestAlternatives(tee, catalog)).toEqual([]);
  });
});
