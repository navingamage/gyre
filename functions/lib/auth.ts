import { getUserIdForSession, readSessionToken } from "./session";
import { findUserById, type UserRow } from "./users";

export async function getCurrentUser(request: Request, db: D1Database): Promise<UserRow | null> {
  const token = readSessionToken(request);
  if (!token) return null;
  const userId = await getUserIdForSession(db, token);
  if (!userId) return null;
  return findUserById(db, userId);
}
