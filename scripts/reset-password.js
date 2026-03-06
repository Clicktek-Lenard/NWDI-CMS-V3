// Usage: node scripts/reset-password.js <username> <new-password>
// Example: node scripts/reset-password.js lenard.palce Admin@123

import { config } from "dotenv";
config({ path: ".env.local" });

import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

const [, , username, newPassword] = process.argv;

if (!username || !newPassword) {
  console.error("Usage: node scripts/reset-password.js <username> <new-password>");
  process.exit(1);
}

const conn = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cms_v2",
});

const [rows] = await conn.query(
  "SELECT id, username FROM users WHERE username = ? AND deleted_at IS NULL LIMIT 1",
  [username]
);

if (!rows[0]) {
  console.error(`User '${username}' not found.`);
  await conn.end();
  process.exit(1);
}

const hash = await bcrypt.hash(newPassword, 10);
await conn.query("UPDATE users SET password = ? WHERE username = ?", [hash, username]);
await conn.end();

console.log(`Password for '${username}' (id=${rows[0].id}) reset successfully.`);
