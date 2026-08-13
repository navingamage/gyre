export interface OrderItemInput {
  productId: string;
  quantity: number;
  unitPriceCents: number;
}

export interface OrderRow {
  id: string;
  user_id: string;
  status: string;
  total_cents: number;
  stripe_session_id: string | null;
  created_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price_cents: number;
  product_name: string;
}

export async function createPendingOrder(
  db: D1Database,
  userId: string,
  items: OrderItemInput[]
): Promise<string> {
  const orderId = crypto.randomUUID();
  const totalCents = items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);

  const statements = [
    db
      .prepare("INSERT INTO orders (id, user_id, status, total_cents) VALUES (?, ?, 'pending', ?)")
      .bind(orderId, userId, totalCents),
    ...items.map((item) =>
      db
        .prepare(
          "INSERT INTO order_items (id, order_id, product_id, quantity, unit_price_cents) VALUES (?, ?, ?, ?, ?)"
        )
        .bind(crypto.randomUUID(), orderId, item.productId, item.quantity, item.unitPriceCents)
    ),
  ];
  await db.batch(statements);
  return orderId;
}

export async function attachStripeSession(
  db: D1Database,
  orderId: string,
  stripeSessionId: string
): Promise<void> {
  await db
    .prepare("UPDATE orders SET stripe_session_id = ? WHERE id = ?")
    .bind(stripeSessionId, orderId)
    .run();
}

/** Idempotent: safe to call multiple times for the same session (Stripe retries webhooks). */
export async function markOrderPaidByStripeSession(
  db: D1Database,
  stripeSessionId: string
): Promise<void> {
  await db
    .prepare("UPDATE orders SET status = 'paid' WHERE stripe_session_id = ?")
    .bind(stripeSessionId)
    .run();
}

async function attachItems(db: D1Database, orders: OrderRow[]): Promise<(OrderRow & { items: OrderItemRow[] })[]> {
  if (orders.length === 0) return [];
  const placeholders = orders.map(() => "?").join(",");
  const { results } = await db
    .prepare(
      `SELECT oi.*, p.name AS product_name
       FROM order_items oi JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id IN (${placeholders})`
    )
    .bind(...orders.map((o) => o.id))
    .all<OrderItemRow>();

  return orders.map((order) => ({
    ...order,
    items: results.filter((item) => item.order_id === order.id),
  }));
}

export async function getOrdersForUser(db: D1Database, userId: string) {
  const { results } = await db
    .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC")
    .bind(userId)
    .all<OrderRow>();
  return attachItems(db, results);
}

export async function getOrderByStripeSession(db: D1Database, userId: string, stripeSessionId: string) {
  const order = await db
    .prepare("SELECT * FROM orders WHERE stripe_session_id = ? AND user_id = ?")
    .bind(stripeSessionId, userId)
    .first<OrderRow>();
  if (!order) return null;
  const [withItems] = await attachItems(db, [order]);
  return withItems;
}
