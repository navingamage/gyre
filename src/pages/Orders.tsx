import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface OrderItem {
  id: string;
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

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch("/api/orders", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load orders");
        return res.json();
      })
      .then(setOrders)
      .catch(() => setError("Couldn't load your orders."));
  }, [user]);

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-6 py-12">
        <p className="text-deep dark:text-foam">
          <Link to="/login?redirect=/orders" className="text-kelp dark:text-foam/70 underline">
            Sign in
          </Link>{" "}
          to view your orders.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-deep dark:text-foam mb-6">
        Your orders
      </h1>

      {error && <p className="text-coral">{error}</p>}

      {orders && orders.length === 0 && (
        <p className="text-kelp dark:text-foam/70">
          No orders yet.{" "}
          <Link to="/shop" className="underline">
            Start shopping
          </Link>
          .
        </p>
      )}

      <ul className="space-y-4">
        {orders?.map((order) => (
          <li
            key={order.id}
            className="rounded-xl bg-white dark:bg-slate-800 ring-1 ring-deep/5 dark:ring-white/5 p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-kelp dark:text-foam/70">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  order.status === "paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {order.status === "paid" ? "Paid" : "Pending"}
              </span>
            </div>
            <ul className="mt-2 text-sm text-deep dark:text-foam space-y-0.5">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.quantity} × {item.product_name}
                </li>
              ))}
            </ul>
            <p className="mt-2 font-semibold text-deep dark:text-foam">
              ${(order.total_cents / 100).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
