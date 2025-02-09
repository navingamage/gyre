import type { Product } from "../types";

const KNOWN_PLASTICS = [
  "polyester",
  "nylon",
  "acrylic",
  "elastane",
  "spandex",
  "polypropylene",
  "polyethylene",
  "pvc",
  "nitrile",
];

export interface RatingBreakdown {
  score: number; // 0 (worst) - 100 (best)
  grade: "A" | "B" | "C" | "D" | "F";
  synthetics: string[];
  packagingPenalty: number;
}

/**
 * Scores a product from 0-100. Starts at 100 and deducts for known
 * plastic-derived materials/synthetics and non-plastic-free packaging.
 * Deliberately simple and auditable rather than a black box, since the
 * rating is the thing customers are trusting.
 */
export function rateProduct(product: Product): RatingBreakdown {
  let score = 100;

  const flaggedSynthetics = product.synthetics.filter((s) =>
    KNOWN_PLASTICS.some((plastic) => s.toLowerCase().includes(plastic))
  );
  score -= flaggedSynthetics.length * 20;

  const flaggedMaterials = product.materials.filter((m) =>
    KNOWN_PLASTICS.some((plastic) => m.toLowerCase().includes(plastic))
  );
  score -= flaggedMaterials.length * 25;

  let packagingPenalty = 0;
  if (product.packaging === "recycled-plastic") packagingPenalty = 10;
  if (product.packaging === "mixed") packagingPenalty = 20;
  score -= packagingPenalty;

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    grade: toGrade(score),
    synthetics: [...flaggedSynthetics, ...flaggedMaterials],
    packagingPenalty,
  };
}

function toGrade(score: number): RatingBreakdown["grade"] {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "F";
}
