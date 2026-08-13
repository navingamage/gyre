import type { Product } from "../types";
import { rateProduct } from "./rating";

/**
 * Suggests up to `limit` alternatives from `catalog` in the same category
 * with a strictly better microplastic rating than the given product.
 */
export function suggestAlternatives(product: Product, catalog: Product[], limit = 3): Product[] {
  const baseline = rateProduct(product).score;

  return catalog
    .filter((p) => p.id !== product.id && p.category === product.category)
    .map((p) => ({ product: p, score: rateProduct(p).score }))
    .filter(({ score }) => score > baseline)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ product }) => product);
}
