import { describe, it, expect } from "vitest";
import {
  clearSessionCookie,
  createSession,
  getUserIdForSession,
  readSessionToken,
  setSessionCookie,
} from "./session";
import { sha256Hex } from "./crypto";

/**
 * Minimal D1 stub that records the statements it was given. Enough to assert
 * what actually reaches the database, which is the point of these tests.
 */
function stubDb(firstResult: unknown = null) {
  const calls: { sql: string; args: unknown[] }[] = [];
  const db = {
    prepare(sql: string) {
      const entry = { sql, args: [] as unknown[] };
      calls.push(entry);
      const stmt = {
        bind(...args: unknown[]) {
          entry.args = args;
          return stmt;
        },
        run: async () => ({}),
        first: async () => firstResult,
      };
      return stmt;
    },
  } as unknown as D1Database;
  return { db, calls };
}

describe("createSession", () => {
  it("stores the hash of the token, never the token itself", async () => {
    const { db, calls } = stubDb();
    const token = await createSession(db, "user-1");

    const insert = calls.find((c) => c.sql.includes("INSERT INTO sessions"))!;
    const [storedId, userId] = insert.args as [string, string, string];

    expect(userId).toBe("user-1");
    expect(storedId).toBe(await sha256Hex(token));
    // The raw token must not appear anywhere in what was written.
    expect(JSON.stringify(insert.args)).not.toContain(token);
  });

  it("issues a distinct token every time", async () => {
    const { db } = stubDb();
    const a = await createSession(db, "user-1");
    const b = await createSession(db, "user-1");
    expect(a).not.toBe(b);
  });

  it("sets an expiry in the future", async () => {
    const { db, calls } = stubDb();
    await createSession(db, "user-1");
    const insert = calls.find((c) => c.sql.includes("INSERT INTO sessions"))!;
    const expiresAt = new Date(insert.args[2] as string).getTime();
    expect(expiresAt).toBeGreaterThan(Date.now());
  });
});

describe("getUserIdForSession", () => {
  it("returns the user for a live session", async () => {
    const future = new Date(Date.now() + 60_000).toISOString();
    const { db } = stubDb({ user_id: "user-1", expires_at: future });
    expect(await getUserIdForSession(db, "any-token")).toBe("user-1");
  });

  it("refuses an expired session even though the row still exists", async () => {
    const past = new Date(Date.now() - 60_000).toISOString();
    const { db } = stubDb({ user_id: "user-1", expires_at: past });
    expect(await getUserIdForSession(db, "any-token")).toBeNull();
  });

  it("returns null when no session row matches", async () => {
    const { db } = stubDb(null);
    expect(await getUserIdForSession(db, "any-token")).toBeNull();
  });

  it("looks the session up by hash, not by the raw token", async () => {
    const { db, calls } = stubDb(null);
    await getUserIdForSession(db, "raw-token-value");
    const select = calls.find((c) => c.sql.includes("SELECT user_id"))!;
    expect(select.args[0]).toBe(await sha256Hex("raw-token-value"));
    expect(select.args[0]).not.toBe("raw-token-value");
  });
});

describe("session cookies", () => {
  const httpsRequest = new Request("https://gyre.antipodetech.com/api/auth/login");
  const httpRequest = new Request("http://localhost:8788/api/auth/login");

  it("marks the cookie HttpOnly and SameSite=Lax", () => {
    const cookie = setSessionCookie(httpsRequest, "tok");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Path=/");
  });

  it("adds Secure over https and omits it over plain http", () => {
    expect(setSessionCookie(httpsRequest, "tok")).toContain("Secure");
    // Local `wrangler pages dev` serves http://, where Secure would stop the
    // cookie being stored at all.
    expect(setSessionCookie(httpRequest, "tok")).not.toContain("Secure");
  });

  it("url-encodes tokens containing cookie-hostile characters", () => {
    const cookie = setSessionCookie(httpsRequest, "a+b/c=d;e");
    expect(cookie).toContain(encodeURIComponent("a+b/c=d;e"));
    // A raw ';' would terminate the cookie value early.
    expect(cookie.split(";")[0]).not.toContain(";e");
  });

  it("expires the cookie immediately when cleared", () => {
    expect(clearSessionCookie(httpsRequest)).toContain("Max-Age=0");
  });

  it("round-trips a token through Set-Cookie and Cookie parsing", () => {
    const token = "a+b/c=d";
    const setCookie = setSessionCookie(httpsRequest, token);
    const value = setCookie.split(";")[0];
    const request = new Request("https://example.com", { headers: { Cookie: value } });
    expect(readSessionToken(request)).toBe(token);
  });

  it("finds its cookie alongside unrelated cookies", () => {
    const request = new Request("https://example.com", {
      headers: { Cookie: "other=1; gyre_session=tok123; another=2" },
    });
    expect(readSessionToken(request)).toBe("tok123");
  });

  it("returns null when there is no session cookie", () => {
    expect(readSessionToken(new Request("https://example.com"))).toBeNull();
    const request = new Request("https://example.com", { headers: { Cookie: "other=1" } });
    expect(readSessionToken(request)).toBeNull();
  });

  it("does not mistake a cookie whose name merely ends in the session name", () => {
    const request = new Request("https://example.com", {
      headers: { Cookie: "not_gyre_session=attacker" },
    });
    expect(readSessionToken(request)).toBeNull();
  });
});
