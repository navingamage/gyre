import type { Env } from "../../lib/env";
import { verifyPassword } from "../../lib/hash";
import { createSession, setSessionCookie } from "../../lib/session";
import { findUserByEmail, publicUser } from "../../lib/users";
import { isValidEmail, isValidPassword } from "../../lib/validate";

const INVALID_CREDENTIALS = { error: "Invalid email or password" };

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, password } = (body ?? {}) as { email?: unknown; password?: unknown };
  if (!isValidEmail(email) || !isValidPassword(password)) {
    return Response.json(INVALID_CREDENTIALS, { status: 401 });
  }

  const user = await findUserByEmail(env.DB, email);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return Response.json(INVALID_CREDENTIALS, { status: 401 });
  }

  const token = await createSession(env.DB, user.id);
  return Response.json(publicUser(user), {
    headers: { "Set-Cookie": setSessionCookie(request, token) },
  });
};
