import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price_cents: number;
}

interface Order {
  id: string;
  status: string;
  total_cents: number;
  created_at: string;
  items: OrderItem[];
}

const POLL_ATTEMPTS = 5;
const POLL_INTERVAL_MS = 2000;

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clear } = useCart();
  const clearedRef = useRef(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clearedRef.current) {
      clearedRef.current = true;
      clear();
    }
  }, [clear]);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing order reference.");
      return;
    }

    let cancelled = false;
    let attempt = 0;

    async function poll() {
      attempt += 1;
      try {
        const res = await fetch(`/api/orders/by-session?session_id=${encodeURIComponent(sessionId!)}`, {
          credentials: "include",
        });
        if (!res.ok) {
          if (!cancelled) setError("Couldn't find that order.");
          return;
        }
        const data = (await res.json()) as Order;
        if (cancelled) return;
        setOrder(data);
        if (data.status === "pending" && attempt < POLL_ATTEMPTS) {
          setTimeout(poll, POLL_INTERVAL_MS);
        }
      } catch {
        if (!cancelled) setError("Couldn't reach the server.");
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center">
      <h1 className="font-display text-3xl font-bold text-deep dark:text-foam">
        {order?.status === "paid" ? "Order confirmed" : "Thanks for your order"}
      </h1>

      {error && <p className="mt-2 text-coral">{error}</p>}

      {order && (
        <div className="mt-6 text-left rounded-xl bg-white dark:bg-slate-800 ring-1 ring-deep/5 dark:ring-white/5 p-6">
          <p className="text-sm text-kelp dark:text-foam/70">
            Status:{" "}
            <span className="font-medium text-deep dark:text-foam">
              {order.status === "paid" ? "Paid" : "Awaiting payment confirmation…"}
            </span>
          </p>
          <ul className="mt-4 space-y-1 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between text-deep dark:text-foam">
                <span>
                  {item.quantity} × {item.product_name}
                </span>
                <span>${((item.unit_price_cents * item.quantity) / 100).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 pt-4 border-t border-deep/10 dark:border-slate-700 font-semibold text-deep dark:text-foam">
            Total: ${(order.total_cents / 100).toFixed(2)}
          </p>
        </div>
      )}

      <Link to="/shop" className="mt-6 inline-block text-kelp dark:text-foam/70 underline">
        Back to shop
      </Link>
    </div>
  );
}
