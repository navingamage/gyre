import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { lines, setQuantity, removeItem, total } = useCart();

  if (lines.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
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
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-deep dark:text-foam mb-6">
        Your cart
      </h1>
      <ul className="space-y-4">
        {lines.map((line) => (
          <li
            key={line.product.id}
            className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl ring-1 ring-deep/5 dark:ring-white/5 p-4 shadow-sm"
          >
            <div>
              <p className="font-medium text-deep dark:text-foam">{line.product.name}</p>
              <p className="text-sm text-kelp dark:text-foam/70">${line.product.price} each</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                aria-label={`Quantity for ${line.product.name}`}
                value={line.quantity}
                onChange={(e) => {
                  const parsed = parseInt(e.target.value, 10);
                  setQuantity(line.product.id, Number.isNaN(parsed) ? 0 : parsed);
                }}
                className="w-16 border border-deep/20 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-800 dark:text-foam"
              />
              <button
                onClick={() => removeItem(line.product.id)}
                aria-label={`Remove ${line.product.name} from cart`}
                className="text-sm text-coral focus:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-lg font-semibold text-deep dark:text-foam">
          Total: ${total.toFixed(2)}
        </p>
        <Link
          to="/checkout"
          className="rounded-full bg-deep text-white dark:bg-foam dark:text-deep px-6 py-2.5 font-medium hover:opacity-90 transition-opacity"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
