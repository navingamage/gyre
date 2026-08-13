import type { Env } from "../../lib/env";
import { getCurrentUser } from "../../lib/auth";
import { getOrderByStripeSession } from "../../lib/orders";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await getCurrentUser(request, env.DB);
  if (!user) return Response.json({ error: "Sign in to view this order" }, { status: 401 });

  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) return Response.json({ error: "Missing session_id" }, { status: 400 });

  const order = await getOrderByStripeSession(env.DB, user.id, sessionId);
  if (!order) return Response.json({ error: "Order not found" }, { status: 404 });

  return Response.json(order);
};
