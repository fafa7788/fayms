#!/usr/bin/env node
/**
 * Creates (or resets) the FAYMS admin account.
 * Usage: npm run create-admin -- --username admin --password "yourStrongPassword"
 * Or run with no flags for interactive prompts.
 */
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import readline from "readline";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, "fayms.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : null;
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (answer) => { rl.close(); resolve(answer); }));
}

async function main() {
  let username = arg("username");
  let password = arg("password");

  if (!username) username = (await ask("Admin username: ")).trim();
  if (!password) password = (await ask("Admin password (min 10 chars): ")).trim();

  if (!username || username.length < 3) {
    console.error("Username must be at least 3 characters.");
    process.exit(1);
  }
  if (!password || password.length < 10) {
    console.error("Password must be at least 10 characters.");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);
  const existing = db.prepare("SELECT id FROM admins WHERE username = ?").get(username);

  if (existing) {
    db.prepare("UPDATE admins SET password_hash = ? WHERE username = ?").run(hash, username);
    console.log(`Password updated for admin "${username}".`);
  } else {
    db.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").run(username, hash);
    console.log(`Admin account "${username}" created.`);
  }
  console.log("You can now log in at /admin/login");
  process.exit(0);
}

main();
