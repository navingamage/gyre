import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { lines, total } = useCart();
  const [placed, setPlaced] = useState(false);

  if (placed) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-deep dark:text-foam">
          Order placed
        </h1>
        <p className="mt-2 text-kelp dark:text-foam/70">
          Thanks — this is a demo checkout, so nothing was actually charged or shipped.
        </p>
        <Link to="/shop" className="mt-6 inline-block text-kelp dark:text-foam/70 underline">
          Back to shop
        </Link>
      </div>
    );
  }

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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPlaced(true);
        }}
        className="space-y-3"
      >
        <input
          required
          type="email"
          placeholder="Email"
          className="w-full border border-deep/20 dark:border-slate-600 rounded-lg px-3 py-2.5 bg-white dark:bg-slate-800 dark:text-foam focus:outline-none focus:ring-2 focus:ring-kelp"
        />
        <input
          required
          type="text"
          placeholder="Shipping address"
          className="w-full border border-deep/20 dark:border-slate-600 rounded-lg px-3 py-2.5 bg-white dark:bg-slate-800 dark:text-foam focus:outline-none focus:ring-2 focus:ring-kelp"
        />
        <button
          type="submit"
          className="w-full rounded-full bg-deep text-white dark:bg-foam dark:text-deep px-5 py-3 font-medium hover:opacity-90 transition-opacity"
        >
          Place order
        </button>
      </form>
    </div>
  );
}
