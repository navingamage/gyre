import type { Env } from "../../lib/env";
import { getCurrentUser } from "../../lib/auth";
import { publicUser } from "../../lib/users";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await getCurrentUser(request, env.DB);
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });
  return Response.json(publicUser(user));
};
