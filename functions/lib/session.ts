import { sha256Hex, toBase64 } from "./crypto";

const COOKIE_NAME = "gyre_session";
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

export async function createSession(db: D1Database, userId: string): Promise<string> {
  const token = toBase64(crypto.getRandomValues(new Uint8Array(32)));
  const tokenHash = await sha256Hex(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();
  await db
    .prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
    .bind(tokenHash, userId, expiresAt)
    .run();
  return token;
}

export async function getUserIdForSession(db: D1Database, token: string): Promise<string | null> {
  const tokenHash = await sha256Hex(token);
  const row = await db
    .prepare("SELECT user_id, expires_at FROM sessions WHERE id = ?")
    .bind(tokenHash)
    .first<{ user_id: string; expires_at: string }>();
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    await db.prepare("DELETE FROM sessions WHERE id = ?").bind(tokenHash).run();
    return null;
  }
  return row.user_id;
}

export async function destroySession(db: D1Database, token: string): Promise<void> {
  const tokenHash = await sha256Hex(token);
  await db.prepare("DELETE FROM sessions WHERE id = ?").bind(tokenHash).run();
}

export function readSessionToken(request: Request): string | null {
  const header = request.headers.get("Cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === COOKIE_NAME) return decodeURIComponent(rest.join("="));
  }
  return null;
}

/** Secure requires HTTPS, which local `wrangler pages dev` over http:// doesn't have. */
function isHttps(request: Request): boolean {
  return new URL(request.url).protocol === "https:";
}

export function setSessionCookie(request: Request, token: string): string {
  const secure = isHttps(request) ? " Secure;" : "";
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly;${secure} SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}`;
}

export function clearSessionCookie(request: Request): string {
  const secure = isHttps(request) ? " Secure;" : "";
  return `${COOKIE_NAME}=; Path=/; HttpOnly;${secure} SameSite=Lax; Max-Age=0`;
}
