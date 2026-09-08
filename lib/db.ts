import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL || "file:data/fayms.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url,
  authToken,
});

// تهيئة الجداول في قاعدة بيانات Turso
async function initDb() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT,
      project_url TEXT,
      published INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      project_type TEXT,
      message TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

initDb().catch((err) => {
  console.error("Failed to initialize database tables:", err);
});

// محاكي لدعم دوال better-sqlite3 القديمة (prepare, all, get, run)
export const db: any = {
  prepare(sql: string) {
    return {
      async all(...params: any[]) {
        const res = await client.execute({ sql, args: params.flat() });
        return res.rows;
      },
      async get(...params: any[]) {
        const res = await client.execute({ sql, args: params.flat() });
        return res.rows[0];
      },
      async run(...params: any[]) {
        const res = await client.execute({ sql, args: params.flat() });
        return {
          lastInsertRowid: res.lastInsertRowid,
          changes: res.rowsAffected,
        };
      },
    };
  },
  async exec(sql: string) {
    return await client.executeMultiple(sql);
  },
  pragma(_query: string) {
    return null;
  },
};

export default db;

export type Project = {
  id: number;
  name: string;
  description: string;
  category: string;
  image_url: string | null;
  project_url: string | null;
  published: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Admin = {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
};