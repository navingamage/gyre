import { Link, useParams } from "react-router-dom";
import { getProductBySlug } from "../lib/products";
import { rateProduct } from "../lib/rating";
import { suggestAlternatives } from "../lib/alternatives";
import { CATEGORY_TINT } from "../lib/categoryStyles";
import { useCart } from "../context/CartContext";
import RatingBadge from "../components/RatingBadge";
import ProductCard from "../components/ProductCard";
import CategoryIcon from "../components/icons/CategoryIcon";

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
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link to="/shop" className="text-sm text-kelp dark:text-foam/70 hover:underline">
        ← Back to shop
      </Link>

      <div className="mt-4 grid md:grid-cols-2 gap-10">
        <div
          className={`rounded-2xl flex items-center justify-center h-72 md:h-full min-h-72 ${CATEGORY_TINT[product.category]}`}
        >
          <CategoryIcon category={product.category} className="h-20 w-20" />
        </div>

        <div>
          <div className="flex items-start gap-3">
            <h1 className="font-display text-3xl font-bold text-deep dark:text-foam">
              {product.name}
            </h1>
            <RatingBadge rating={rating} />
          </div>
          <p className="text-kelp dark:text-foam/70 mt-1">
            {product.brand} · ${product.price}
          </p>
          <p className="mt-4 text-deep/90 dark:text-foam/90 leading-relaxed">
            {product.description}
          </p>
          <button
            onClick={() => addItem(product)}
            className="mt-6 rounded-full bg-deep text-white dark:bg-foam dark:text-deep px-6 py-3 font-medium hover:opacity-90 transition-opacity"
          >
            Add to cart
          </button>

          <div className="mt-8 pt-6 border-t border-deep/10 dark:border-slate-700 text-sm">
            <p className="font-medium text-deep dark:text-foam">Materials</p>
            <p className="text-kelp dark:text-foam/70">{product.materials.join(", ") || "—"}</p>
            {rating.synthetics.length > 0 && (
              <p className="mt-2 text-orange-700 dark:text-orange-400">
                Flagged as plastic-derived: {rating.synthetics.join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>

      {alternatives.length > 0 && (
        <div className="mt-16">
          <p className="font-display text-xl font-semibold text-deep dark:text-foam mb-4">
            Cleaner alternatives
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {alternatives.map((alt) => (
              <ProductCard key={alt.id} product={alt} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
