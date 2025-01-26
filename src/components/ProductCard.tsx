import { Link } from "react-router-dom";
import type { Product } from "../types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="block bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <p className="font-medium text-deep">{product.name}</p>
      <p className="text-sm text-kelp">
        {product.brand} · ${product.price}
      </p>
    </Link>
  );
}
