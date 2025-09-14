import { Link } from "react-router-dom";
import type { Product } from "../types";
import { rateProduct } from "../lib/rating";
import RatingBadge from "./RatingBadge";

export default function ProductCard({ product }: { product: Product }) {
  const rating = rateProduct(product);
  return (
    <Link
      to={`/products/${product.slug}`}
      className="block bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-deep dark:text-foam">{product.name}</p>
        <RatingBadge rating={rating} />
      </div>
      <p className="text-sm text-kelp dark:text-foam/70 mt-1">
        {product.brand} · ${product.price}
      </p>
    </Link>
  );
}
