import type { Env } from "../../lib/env";
import { clearSessionCookie, destroySession, readSessionToken } from "../../lib/session";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const token = readSessionToken(request);
  if (token) await destroySession(env.DB, token);

  return new Response(null, { status: 204, headers: { "Set-Cookie": clearSessionCookie(request) } });
};
