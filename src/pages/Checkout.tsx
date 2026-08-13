import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { lines, total } = useCart();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (lines.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-12">
        <p className="text-deep dark:text-foam">
          Your cart is empty.{" "}
          <Link to="/shop" className="text-kelp dark:text-foam/70 underline">
            Keep shopping
          </Link>
          .
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-6 py-12">
        <p className="text-deep dark:text-foam">
          <Link to="/login?redirect=/checkout" className="text-kelp dark:text-foam/70 underline">
            Sign in
          </Link>{" "}
          to complete your purchase.
        </p>
      </div>
    );
  }

  async function handleCheckout() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((line) => ({ productId: line.product.id, quantity: line.quantity })),
        }),
      });
      const body = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !body.url) {
        setError(body.error ?? "Something went wrong starting checkout.");
        setSubmitting(false);
        return;
      }
      window.location.href = body.url;
    } catch {
      setError("Couldn't reach the server. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-deep dark:text-foam mb-6">
        Checkout
      </h1>
      <ul className="text-sm text-kelp dark:text-foam/70 space-y-1 mb-6">
        {lines.map((line) => (
          <li key={line.product.id}>
            {line.quantity} × {line.product.name}
          </li>
        ))}
      </ul>
      <p className="font-semibold text-deep dark:text-foam mb-6">Total: ${total.toFixed(2)}</p>
      {error && <p className="text-sm text-coral mb-4">{error}</p>}
      <button
        onClick={handleCheckout}
        disabled={submitting}
        className="w-full rounded-full bg-deep text-white dark:bg-foam dark:text-deep px-5 py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {submitting ? "Redirecting to payment…" : "Continue to payment"}
      </button>
      <p className="text-xs text-kelp dark:text-foam/60 mt-3">
        You'll be redirected to Stripe to enter payment details.
      </p>
    </div>
  );
}
