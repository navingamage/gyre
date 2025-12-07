import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { lines, setQuantity, removeItem, total } = useCart();

  if (lines.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <p>Your cart is empty. <Link to="/" className="text-kelp underline">Keep shopping</Link>.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-deep mb-6">Your cart</h1>
      <ul className="space-y-4">
        {lines.map((line) => (
          <li key={line.product.id} className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
            <div>
              <p className="font-medium text-deep">{line.product.name}</p>
              <p className="text-sm text-kelp">${line.product.price} each</p>
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
                className="w-16 border border-deep/20 rounded px-2 py-1"
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
        <p className="text-lg font-semibold text-deep">Total: ${total.toFixed(2)}</p>
        <Link to="/checkout" className="bg-deep text-white px-5 py-2 rounded-md">
          Checkout
        </Link>
      </div>
    </div>
  );
}
