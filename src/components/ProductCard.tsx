import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types";
import { rateProduct } from "../lib/rating";
import { CATEGORY_TINT } from "../lib/categoryStyles";
import RatingBadge from "./RatingBadge";
import CategoryIcon from "./icons/CategoryIcon";

export default function ProductCard({ product }: { product: Product }) {
  const rating = useMemo(() => rateProduct(product), [product]);

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm ring-1 ring-deep/5 dark:ring-white/5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-kelp"
    >
      <div
        className={`flex items-center justify-center h-28 ${CATEGORY_TINT[product.category]}`}
      >
        <CategoryIcon category={product.category} className="h-9 w-9" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-deep dark:text-foam leading-snug">{product.name}</p>
          <RatingBadge rating={rating} />
        </div>
        <p className="text-sm text-kelp dark:text-foam/70 mt-1">
          {product.brand} · ${product.price}
        </p>
      </div>
    </Link>
  );
}
