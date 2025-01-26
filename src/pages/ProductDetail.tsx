import { useParams } from "react-router-dom";
import { getProductBySlug } from "../lib/products";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return <div className="max-w-2xl mx-auto px-6 py-10">Product not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-deep">{product.name}</h1>
      <p className="text-kelp mt-1">
        {product.brand} · ${product.price}
      </p>
      <p className="mt-4">{product.description}</p>
    </div>
  );
}
