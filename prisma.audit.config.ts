import { config } from "dotenv";

// Load .env for the AUDIT_DATABASE_URL
config();

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/audit.schema.prisma",
  datasource: {
    url: env("AUDIT_DATABASE_URL"),
  },
});
