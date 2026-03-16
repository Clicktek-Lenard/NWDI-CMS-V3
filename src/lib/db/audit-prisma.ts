import { PrismaClient } from "../../generated/audit-prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForAudit = globalThis as unknown as { auditPrisma?: PrismaClient };

function createAuditClient() {
  const connectionString = process.env.AUDIT_DATABASE_URL;
  if (!connectionString) {
    throw new Error("AUDIT_DATABASE_URL environment variable is not set");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

const auditPrisma = globalForAudit.auditPrisma ?? createAuditClient();

if (process.env.NODE_ENV !== "production") {
  globalForAudit.auditPrisma = auditPrisma;
}

export default auditPrisma;
