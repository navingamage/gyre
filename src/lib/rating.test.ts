import { describe, it, expect } from "vitest";
import { rateProduct } from "./rating";
import type { Product } from "../types";

function makeProduct(overrides: Partial<Product>): Product {
  return {
    id: "x",
    slug: "x",
    name: "Test product",
    brand: "Test",
    category: "home",
    price: 10,
    materials: [],
    synthetics: [],
    packaging: "plastic-free",
    description: "",
    ...overrides,
  };
}

describe("rateProduct", () => {
  it("gives a clean product a perfect A score", () => {
    const result = rateProduct(makeProduct({ materials: ["stainless-steel"] }));
    expect(result.score).toBe(100);
    expect(result.grade).toBe("A");
  });

  it("penalizes synthetic plastic-derived fibers", () => {
    const result = rateProduct(makeProduct({ synthetics: ["elastane"] }));
    expect(result.score).toBe(80);
    expect(result.synthetics).toContain("elastane");
  });

  it("penalizes plastic materials more heavily than synthetics", () => {
    const result = rateProduct(makeProduct({ materials: ["polyester"] }));
    expect(result.score).toBe(75);
  });

  it("penalizes non-plastic-free packaging", () => {
    const result = rateProduct(makeProduct({ packaging: "mixed" }));
    expect(result.score).toBe(80);
    expect(result.packagingPenalty).toBe(20);
  });

  it("never goes below zero", () => {
    const result = rateProduct(
      makeProduct({
        materials: ["polyester", "nylon", "pvc"],
        synthetics: ["polypropylene", "elastane"],
        packaging: "mixed",
      })
    );
    expect(result.score).toBe(0);
    expect(result.grade).toBe("F");
  });

  it("is case-insensitive when matching known plastics", () => {
    const result = rateProduct(makeProduct({ synthetics: ["Elastane"] }));
    expect(result.synthetics).toContain("Elastane");
    expect(result.score).toBe(80);
  });

  it("matches plastics embedded in compound material names", () => {
    const result = rateProduct(makeProduct({ materials: ["recycled-polyethylene"] }));
    expect(result.synthetics).toContain("recycled-polyethylene");
    expect(result.score).toBe(75);
  });

  it("does not flag natural materials that merely contain similar substrings", () => {
    const result = rateProduct(makeProduct({ materials: ["organic-cotton", "beeswax"] }));
    expect(result.synthetics).toEqual([]);
    expect(result.score).toBe(100);
  });

  it("assigns grade boundaries correctly", () => {
    expect(rateProduct(makeProduct({ synthetics: ["elastane"] })).grade).toBe("B"); // 80
    expect(rateProduct(makeProduct({ materials: ["polyester"] })).grade).toBe("B"); // 75
    expect(
      rateProduct(makeProduct({ materials: ["polyester"], packaging: "mixed" })).grade
    ).toBe("D"); // 55
  });
});
