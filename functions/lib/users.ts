export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export async function findUserByEmail(db: D1Database, email: string): Promise<UserRow | null> {
  const row = await db
    .prepare("SELECT * FROM users WHERE email = ?")
    .bind(email.toLowerCase())
    .first<UserRow>();
  return row ?? null;
}

export async function findUserById(db: D1Database, id: string): Promise<UserRow | null> {
  const row = await db.prepare("SELECT * FROM users WHERE id = ?").bind(id).first<UserRow>();
  return row ?? null;
}

export async function createUser(
  db: D1Database,
  email: string,
  passwordHash: string
): Promise<string> {
  const id = crypto.randomUUID();
  await db
    .prepare("INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)")
    .bind(id, email.toLowerCase(), passwordHash)
    .run();
  return id;
}

export function publicUser(user: UserRow): { id: string; email: string } {
  return { id: user.id, email: user.email };
}
