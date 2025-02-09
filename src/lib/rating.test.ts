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
    image: "",
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
});
