import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

/**
 * GET /api/transaction-types
 * Returns active transaction types ordered by Code.
 */
export async function GET(request: NextRequest) {
  await requireApiAuth(request, "cms", "queue");

  try {
    const types = await prisma.transactiontype.findMany({
      where:   { Status: 1 },
      select:  { Code: true, Description: true },
      orderBy: { Code: "asc" },
    });

    return NextResponse.json({ data: types });
  } catch (error) {
    console.error("Transaction types query error:", error);
    return NextResponse.json({ data: [] });
  }
}
