import type { Env } from "../../lib/env";
import { hashPassword } from "../../lib/hash";
import { createSession, setSessionCookie } from "../../lib/session";
import { createUser, findUserByEmail } from "../../lib/users";
import { isValidEmail, isValidPassword } from "../../lib/validate";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, password } = (body ?? {}) as { email?: unknown; password?: unknown };
  if (!isValidEmail(email)) {
    return Response.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  if (!isValidPassword(password)) {
    return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const existing = await findUserByEmail(env.DB, email);
  if (existing) {
    return Response.json({ error: "An account with that email already exists" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const userId = await createUser(env.DB, email, passwordHash);
  const token = await createSession(env.DB, userId);

  return Response.json(
    { id: userId, email: email.toLowerCase() },
    { status: 201, headers: { "Set-Cookie": setSessionCookie(request, token) } }
  );
};
