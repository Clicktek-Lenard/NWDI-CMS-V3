import { config } from "dotenv";

// For Prisma CLI: use .env (PostgreSQL) not .env.local (old MySQL)
config();

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
