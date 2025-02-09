import { useParams } from "react-router-dom";
import { getProductBySlug } from "../lib/products";
import { rateProduct } from "../lib/rating";
import RatingBadge from "../components/RatingBadge";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return <div className="max-w-2xl mx-auto px-6 py-10">Product not found.</div>;
  }

  const rating = rateProduct(product);

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-deep">{product.name}</h1>
        <RatingBadge rating={rating} />
      </div>
      <p className="text-kelp mt-1">
        {product.brand} · ${product.price}
      </p>
      <p className="mt-4">{product.description}</p>

      <div className="mt-6 text-sm">
        <p className="font-medium text-deep">Materials</p>
        <p className="text-kelp">{product.materials.join(", ") || "—"}</p>
        {rating.synthetics.length > 0 && (
          <p className="mt-2 text-orange-700">
            Flagged as plastic-derived: {rating.synthetics.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
