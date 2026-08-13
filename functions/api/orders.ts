import type { Env } from "../lib/env";
import { getCurrentUser } from "../lib/auth";
import { getOrdersForUser } from "../lib/orders";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await getCurrentUser(request, env.DB);
  if (!user) return Response.json({ error: "Sign in to view orders" }, { status: 401 });

  const orders = await getOrdersForUser(env.DB, user.id);
  return Response.json(orders);
};
