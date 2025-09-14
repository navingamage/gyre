import { useParams } from "react-router-dom";
import { getProductBySlug } from "../lib/products";
import { rateProduct } from "../lib/rating";
import { suggestAlternatives } from "../lib/alternatives";
import { useCart } from "../context/CartContext";
import RatingBadge from "../components/RatingBadge";
import ProductCard from "../components/ProductCard";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return <div className="max-w-2xl mx-auto px-6 py-10">Product not found.</div>;
  }

  const rating = rateProduct(product);
  const alternatives = suggestAlternatives(product);
  const { addItem } = useCart();

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-deep dark:text-foam">{product.name}</h1>
        <RatingBadge rating={rating} />
      </div>
      <p className="text-kelp mt-1">
        {product.brand} · ${product.price}
      </p>
      <p className="mt-4">{product.description}</p>
      <button
        onClick={() => addItem(product)}
        className="mt-4 bg-deep text-white px-5 py-2 rounded-md"
      >
        Add to cart
      </button>

      <div className="mt-6 text-sm">
        <p className="font-medium text-deep dark:text-foam">Materials</p>
        <p className="text-kelp">{product.materials.join(", ") || "—"}</p>
        {rating.synthetics.length > 0 && (
          <p className="mt-2 text-orange-700">
            Flagged as plastic-derived: {rating.synthetics.join(", ")}
          </p>
        )}
      </div>

      {alternatives.length > 0 && (
        <div className="mt-10">
          <p className="font-medium text-deep dark:text-foam mb-3">Cleaner alternatives</p>
          <div className="grid grid-cols-2 gap-4">
            {alternatives.map((alt) => (
              <ProductCard key={alt.id} product={alt} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
