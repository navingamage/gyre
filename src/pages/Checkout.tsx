import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { lines, total } = useCart();
  const [placed, setPlaced] = useState(false);

  if (placed) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-deep">Order placed</h1>
        <p className="mt-2 text-kelp">
          Thanks — this is a demo checkout, so nothing was actually charged or shipped.
        </p>
        <Link to="/" className="mt-6 inline-block text-kelp underline">
          Back to shop
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-10">
        <p>Your cart is empty. <Link to="/" className="text-kelp underline">Keep shopping</Link>.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-deep mb-6">Checkout</h1>
      <ul className="text-sm text-kelp space-y-1 mb-6">
        {lines.map((line) => (
          <li key={line.product.id}>
            {line.quantity} × {line.product.name}
          </li>
        ))}
      </ul>
      <p className="font-semibold text-deep mb-6">Total: ${total.toFixed(2)}</p>
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
          className="w-full border border-deep/20 rounded px-3 py-2"
        />
        <input
          required
          type="text"
          placeholder="Shipping address"
          className="w-full border border-deep/20 rounded px-3 py-2"
        />
        <button type="submit" className="w-full bg-deep text-white px-5 py-2 rounded-md">
          Place order
        </button>
      </form>
    </div>
  );
}
