import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

const VALID_TYPES = [
  "bookkeeper",
  "cash",
  "cashier-summary",
  "hmo",
  "per-item",
  "sendout",
  "summary",
  "amendment",
] as const;

type ReportType = (typeof VALID_TYPES)[number];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;

  try {
    await requireApiAuth(request, "cms", "reports");

    if (!VALID_TYPES.includes(type as ReportType)) {
      return NextResponse.json({ success: false, error: `Unknown report type: ${type}` }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const branch   = searchParams.get("branch")   || "";
    const dateFrom = searchParams.get("dateFrom")  || "";
    const dateTo   = searchParams.get("dateTo")    || "";
    const page     = Math.max(1, parseInt(searchParams.get("page")     || "1",  10));
    const pageSize = Math.min(200, parseInt(searchParams.get("pageSize") || "50", 10));

    if (!dateFrom || !dateTo) {
      return NextResponse.json({ success: false, error: "dateFrom and dateTo are required" }, { status: 400 });
    }

    const branchCodes = branch ? branch.split(",").map((b) => b.trim()).filter(Boolean) : [];
    const offset = (page - 1) * pageSize;

    const result = await runReport(type as ReportType, {
      dateFrom,
      dateTo,
      branchCodes,
      page,
      pageSize,
      offset,
    });

    return NextResponse.json({
      success: true,
      reportType: type,
      branch: branch || "all",
      dateFrom,
      dateTo,
      ...result,
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error(`[GET /api/reports/${type}]`, error);
    return NextResponse.json({ success: false, error: "Failed to generate report" }, { status: 500 });
  }
}

// ─── Shared params ────────────────────────────────────────────────────────────

interface ReportParams {
  dateFrom: string;
  dateTo: string;
  branchCodes: string[];
  page: number;
  pageSize: number;
  offset: number;
}

// Builds the SQL fragment for branch filter on queue.idbu
function branchFragment(codes: string[], startIdx: number): { sql: string; args: string[] } {
  if (codes.length === 0) return { sql: "", args: [] };
  const placeholders = codes.map((_, i) => `$${startIdx + i}`).join(", ");
  return { sql: `AND q.idbu IN (${placeholders})`, args: codes };
}

// Safe number serialization (BigInt → number)
function n(v: unknown): number {
  if (v === null || v === undefined) return 0;
  if (typeof v === "bigint") return Number(v);
  return Number(v);
}

function strVal(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

// ─── Route dispatcher ─────────────────────────────────────────────────────────

async function runReport(type: ReportType, p: ReportParams) {
  switch (type) {
    case "bookkeeper":      return bookkeeper(p);
    case "cash":            return cash(p);
    case "cashier-summary": return cashierSummary(p);
    case "hmo":             return hmo(p);
    case "per-item":        return perItem(p);
    case "sendout":         return sendout(p);
    case "summary":         return summary(p);
    case "amendment":       return amendment(p);
  }
}

// ─── 1. Bookkeeper ────────────────────────────────────────────────────────────

async function bookkeeper(p: ReportParams) {
  const bf = branchFragment(p.branchCodes, 3);
  const baseArgs: unknown[] = [p.dateFrom, p.dateTo, ...bf.args];

  const countSql = `
    SELECT COUNT(*) AS cnt
    FROM transactions t
    JOIN queue q ON q.id = t.idqueue
    WHERE t.date BETWEEN $1 AND $2
      AND t.status < 650
      ${bf.sql}
  `;

  const rowSql = `
    SELECT
      t.id, t.date, q.code AS queue_code, q.accessionno, q.qfullname AS patient_name,
      q.patienttype AS patient_type, t.namecompany AS company, t.codeitemprice AS item_code,
      t.descriptionitemprice AS item_description, t.transactiontype AS transaction_type,
      t.pricegroupitemprice AS price_group, t.amountitemprice AS amount,
      t.amountremaining AS remaining, t.readersfee AS readers_fee, t.inputby AS input_by,
      t.status
    FROM transactions t
    JOIN queue q ON q.id = t.idqueue
    WHERE t.date BETWEEN $1 AND $2
      AND t.status < 650
      ${bf.sql}
    ORDER BY t.date DESC, q.code ASC
    LIMIT $${baseArgs.length + 1} OFFSET $${baseArgs.length + 2}
  `;

  const sumSql = `
    SELECT SUM(t.amountitemprice) AS total_amount, SUM(t.amountremaining) AS total_remaining
    FROM transactions t
    JOIN queue q ON q.id = t.idqueue
    WHERE t.date BETWEEN $1 AND $2
      AND t.status < 650
      ${bf.sql}
  `;

  const [countRows, dataRows, sumRows] = await Promise.all([
    prisma.$queryRawUnsafe<Array<{ cnt: bigint }>>(countSql, ...baseArgs),
    prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(rowSql, ...baseArgs, p.pageSize, p.offset),
    prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(sumSql, ...baseArgs),
  ]);

  const total = n(countRows[0]?.cnt);
  const s     = sumRows[0] ?? {};

  return {
    data: dataRows.map((r) => ({
      id:              n(r.id),
      date:            strVal(r.date).slice(0, 10),
      queueCode:       strVal(r.queue_code),
      accessionNo:     strVal(r.accessionno),
      patientName:     strVal(r.patient_name),
      patientType:     strVal(r.patient_type),
      company:         strVal(r.company),
      itemCode:        strVal(r.item_code),
      itemDescription: strVal(r.item_description),
      transactionType: strVal(r.transaction_type),
      priceGroup:      strVal(r.price_group),
      amount:          n(r.amount),
      remaining:       n(r.remaining),
      readersFee:      n(r.readers_fee),
      inputBy:         strVal(r.input_by),
      status:          n(r.status),
    })),
    total,
    page: p.page,
    pageSize: p.pageSize,
    totalPages: Math.ceil(total / p.pageSize),
    summary: {
      totalAmount:       n(s.total_amount),
      totalRemaining:    n(s.total_remaining),
      totalTransactions: total,
    },
  };
}

// ─── 2. Cash ─────────────────────────────────────────────────────────────────

async function cash(p: ReportParams) {
  const bf = branchFragment(p.branchCodes, 3);
  const baseArgs: unknown[] = [p.dateFrom, p.dateTo, ...bf.args];

  const countSql = `
    SELECT COUNT(*) AS cnt FROM transactions t JOIN queue q ON q.id = t.idqueue
    WHERE t.date BETWEEN $1 AND $2 AND t.status = 210 ${bf.sql}
  `;
  const rowSql = `
    SELECT t.id, t.date, q.code AS queue_code, q.accessionno, q.qfullname AS patient_name,
      q.patienttype AS patient_type, t.codeitemprice AS item_code,
      t.descriptionitemprice AS item_description,
      (t.amountitemprice - t.amountremaining) AS amount_paid,
      t.readersfee AS readers_fee, t.inputby AS input_by
    FROM transactions t JOIN queue q ON q.id = t.idqueue
    WHERE t.date BETWEEN $1 AND $2 AND t.status = 210 ${bf.sql}
    ORDER BY t.date DESC, q.code ASC
    LIMIT $${baseArgs.length + 1} OFFSET $${baseArgs.length + 2}
  `;
  const sumSql = `
    SELECT SUM(t.amountitemprice) AS total_paid, SUM(t.readersfee) AS total_rf
    FROM transactions t JOIN queue q ON q.id = t.idqueue
    WHERE t.date BETWEEN $1 AND $2 AND t.status = 210 ${bf.sql}
  `;

  const [countRows, dataRows, sumRows] = await Promise.all([
    prisma.$queryRawUnsafe<Array<{ cnt: bigint }>>(countSql, ...baseArgs),
    prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(rowSql, ...baseArgs, p.pageSize, p.offset),
    prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(sumSql, ...baseArgs),
  ]);

  const total = n(countRows[0]?.cnt);
  const s     = sumRows[0] ?? {};

  return {
    data: dataRows.map((r) => ({
      id:              n(r.id),
      date:            strVal(r.date).slice(0, 10),
      queueCode:       strVal(r.queue_code),
      accessionNo:     strVal(r.accessionno),
      patientName:     strVal(r.patient_name),
      patientType:     strVal(r.patient_type),
      itemCode:        strVal(r.item_code),
      itemDescription: strVal(r.item_description),
      amountPaid:      n(r.amount_paid),
      readersFee:      n(r.readers_fee),
      inputBy:         strVal(r.input_by),
    })),
    total,
    page: p.page,
    pageSize: p.pageSize,
    totalPages: Math.ceil(total / p.pageSize),
    summary: {
      totalAmountPaid:   n(s.total_paid),
      totalReadersFee:   n(s.total_rf),
      totalTransactions: total,
    },
  };
}

// ─── 3. Cashier Summary ───────────────────────────────────────────────────────

async function cashierSummary(p: ReportParams) {
  const bf = branchFragment(p.branchCodes, 3);
  const baseArgs: unknown[] = [p.dateFrom, p.dateTo, ...bf.args];

  const sql = `
    SELECT
      COALESCE(t.inputby, '(unknown)') AS cashier,
      COUNT(*) AS tx_count,
      SUM(t.amountitemprice) AS total_amount,
      SUM(t.amountitemprice - t.amountremaining) AS total_collected,
      SUM(t.amountremaining) AS total_remaining
    FROM transactions t
    JOIN queue q ON q.id = t.idqueue
    WHERE t.date BETWEEN $1 AND $2
      AND t.status < 650
      ${bf.sql}
    GROUP BY COALESCE(t.inputby, '(unknown)')
    ORDER BY total_collected DESC
  `;

  const rows = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(sql, ...baseArgs);

  const total = rows.length;
  const paged = rows.slice(p.offset, p.offset + p.pageSize);

  return {
    data: paged.map((r) => ({
      cashier:         strVal(r.cashier),
      txCount:         n(r.tx_count),
      totalAmount:     n(r.total_amount),
      totalCollected:  n(r.total_collected),
      totalRemaining:  n(r.total_remaining),
    })),
    total,
    page: p.page,
    pageSize: p.pageSize,
    totalPages: Math.ceil(total / p.pageSize),
    summary: {
      totalAmount:       rows.reduce((s, r) => s + n(r.total_amount),    0),
      totalCollected:    rows.reduce((s, r) => s + n(r.total_collected), 0),
      totalRemaining:    rows.reduce((s, r) => s + n(r.total_remaining), 0),
      totalTransactions: rows.reduce((s, r) => s + n(r.tx_count),        0),
    },
  };
}

// ─── 4. HMO / Corporate ──────────────────────────────────────────────────────

async function hmo(p: ReportParams) {
  const bf = branchFragment(p.branchCodes, 3);
  const baseArgs: unknown[] = [p.dateFrom, p.dateTo, ...bf.args];

  const countSql = `
    SELECT COUNT(*) AS cnt FROM transactions t JOIN queue q ON q.id = t.idqueue
    WHERE t.date BETWEEN $1 AND $2 AND t.status < 650
      AND t.namecompany IS NOT NULL AND t.namecompany <> '' ${bf.sql}
  `;
  const rowSql = `
    SELECT t.id, t.date, q.code AS queue_code, q.accessionno, q.qfullname AS patient_name,
      t.namecompany AS company, t.hcardnumber AS card_number,
      t.codeitemprice AS item_code, t.descriptionitemprice AS item_description,
      t.pricegroupitemprice AS price_group,
      t.amountitemprice AS amount, t.readersfee AS readers_fee, t.status
    FROM transactions t JOIN queue q ON q.id = t.idqueue
    WHERE t.date BETWEEN $1 AND $2 AND t.status < 650
      AND t.namecompany IS NOT NULL AND t.namecompany <> '' ${bf.sql}
    ORDER BY t.namecompany ASC, t.date DESC
    LIMIT $${baseArgs.length + 1} OFFSET $${baseArgs.length + 2}
  `;
  const sumSql = `
    SELECT SUM(t.amountitemprice) AS total_amount, SUM(t.readersfee) AS total_rf
    FROM transactions t JOIN queue q ON q.id = t.idqueue
    WHERE t.date BETWEEN $1 AND $2 AND t.status < 650
      AND t.namecompany IS NOT NULL AND t.namecompany <> '' ${bf.sql}
  `;

  const [countRows, dataRows, sumRows] = await Promise.all([
    prisma.$queryRawUnsafe<Array<{ cnt: bigint }>>(countSql, ...baseArgs),
    prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(rowSql, ...baseArgs, p.pageSize, p.offset),
    prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(sumSql, ...baseArgs),
  ]);

  const total = n(countRows[0]?.cnt);
  const s     = sumRows[0] ?? {};

  return {
    data: dataRows.map((r) => ({
      id:              n(r.id),
      date:            strVal(r.date).slice(0, 10),
      queueCode:       strVal(r.queue_code),
      accessionNo:     strVal(r.accessionno),
      patientName:     strVal(r.patient_name),
      company:         strVal(r.company),
      cardNumber:      strVal(r.card_number),
      itemCode:        strVal(r.item_code),
      itemDescription: strVal(r.item_description),
      priceGroup:      strVal(r.price_group),
      amount:          n(r.amount),
      readersFee:      n(r.readers_fee),
      status:          n(r.status),
    })),
    total,
    page: p.page,
    pageSize: p.pageSize,
    totalPages: Math.ceil(total / p.pageSize),
    summary: {
      totalAmount:       n(s.total_amount),
      totalReadersFee:   n(s.total_rf),
      totalTransactions: total,
    },
  };
}

// ─── 5. Per Item ─────────────────────────────────────────────────────────────

async function perItem(p: ReportParams) {
  const bf = branchFragment(p.branchCodes, 3);
  const baseArgs: unknown[] = [p.dateFrom, p.dateTo, ...bf.args];

  const sql = `
    SELECT
      COALESCE(t.codeitemprice, '(unknown)') AS item_code,
      MAX(t.descriptionitemprice) AS item_description,
      MAX(t.groupitemmaster)       AS item_group,
      MAX(t.transactiontype)       AS transaction_type,
      COUNT(*)                     AS tx_count,
      AVG(t.amountitemprice)       AS unit_price,
      SUM(t.amountitemprice)       AS total_amount
    FROM transactions t
    JOIN queue q ON q.id = t.idqueue
    WHERE t.date BETWEEN $1 AND $2
      AND t.status < 650
      AND t.codeitemprice IS NOT NULL
      ${bf.sql}
    GROUP BY COALESCE(t.codeitemprice, '(unknown)')
    ORDER BY tx_count DESC
  `;

  const rows = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(sql, ...baseArgs);

  const total = rows.length;
  const paged = rows.slice(p.offset, p.offset + p.pageSize);

  return {
    data: paged.map((r) => ({
      itemCode:        strVal(r.item_code),
      itemDescription: strVal(r.item_description),
      group:           strVal(r.item_group),
      transactionType: strVal(r.transaction_type),
      count:           n(r.tx_count),
      unitPrice:       n(r.unit_price),
      totalAmount:     n(r.total_amount),
    })),
    total,
    page: p.page,
    pageSize: p.pageSize,
    totalPages: Math.ceil(total / p.pageSize),
    summary: {
      totalItems:        total,
      totalTransactions: rows.reduce((s, r) => s + n(r.tx_count),    0),
      totalAmount:       rows.reduce((s, r) => s + n(r.total_amount), 0),
    },
  };
}

// ─── 6. Sendout ───────────────────────────────────────────────────────────────

async function sendout(p: ReportParams) {
  const bf = branchFragment(p.branchCodes, 3);
  const baseArgs: unknown[] = [p.dateFrom, p.dateTo, ...bf.args];

  const countSql = `
    SELECT COUNT(*) AS cnt FROM msg_queue m JOIN queue q ON q.id = m.idqueue
    WHERE q.date BETWEEN $1 AND $2 ${bf.sql.replace("q.idbu", "m.idbu")}
  `;
  const rowSql = `
    SELECT m.id, q.date, m.queuecode AS queue_code, m.accessionno,
      q.qfullname AS patient_name, m.itemgroup AS item_group,
      m.idbu AS from_branch, m.receivedbu AS sent_to, m.status
    FROM msg_queue m JOIN queue q ON q.id = m.idqueue
    WHERE q.date BETWEEN $1 AND $2 ${bf.sql.replace("q.idbu", "m.idbu")}
    ORDER BY q.date DESC, m.id DESC
    LIMIT $${baseArgs.length + 1} OFFSET $${baseArgs.length + 2}
  `;

  const [countRows, dataRows] = await Promise.all([
    prisma.$queryRawUnsafe<Array<{ cnt: bigint }>>(countSql, ...baseArgs),
    prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(rowSql, ...baseArgs, p.pageSize, p.offset),
  ]);

  const total = n(countRows[0]?.cnt);

  return {
    data: dataRows.map((r) => ({
      id:          n(r.id),
      date:        strVal(r.date).slice(0, 10),
      queueCode:   strVal(r.queue_code),
      accessionNo: strVal(r.accessionno),
      patientName: strVal(r.patient_name),
      itemGroup:   strVal(r.item_group),
      fromBranch:  strVal(r.from_branch),
      sentTo:      strVal(r.sent_to),
      status:      strVal(r.status),
    })),
    total,
    page: p.page,
    pageSize: p.pageSize,
    totalPages: Math.ceil(total / p.pageSize),
    summary: { totalSendouts: total },
  };
}

// ─── 7. Summary ───────────────────────────────────────────────────────────────

async function summary(p: ReportParams) {
  const bf = branchFragment(p.branchCodes, 3);
  const baseArgs: unknown[] = [p.dateFrom, p.dateTo, ...bf.args];

  const sql = `
    SELECT
      t.date::date AS report_date,
      q.idbu AS branch,
      COUNT(DISTINCT q.id)                               AS patient_count,
      COUNT(t.id)                                        AS tx_count,
      SUM(t.amountitemprice)                             AS gross_amount,
      SUM(t.readersfee)                                  AS readers_fee,
      SUM(t.amountitemprice) - SUM(t.readersfee)         AS net_amount,
      SUM(t.amountitemprice - t.amountremaining)         AS amount_collected,
      SUM(t.amountremaining)                             AS remaining
    FROM transactions t
    JOIN queue q ON q.id = t.idqueue
    WHERE t.date BETWEEN $1 AND $2
      AND t.status < 650
      ${bf.sql}
    GROUP BY t.date::date, q.idbu
    ORDER BY t.date::date ASC, q.idbu ASC
  `;

  const rows = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(sql, ...baseArgs);

  const total = rows.length;
  const paged = rows.slice(p.offset, p.offset + p.pageSize);

  return {
    data: paged.map((r) => ({
      date:            strVal(r.report_date).slice(0, 10),
      branch:          strVal(r.branch),
      patientCount:    n(r.patient_count),
      txCount:         n(r.tx_count),
      grossAmount:     n(r.gross_amount),
      readersFee:      n(r.readers_fee),
      netAmount:       n(r.net_amount),
      amountCollected: n(r.amount_collected),
      remaining:       n(r.remaining),
    })),
    total,
    page: p.page,
    pageSize: p.pageSize,
    totalPages: Math.ceil(total / p.pageSize),
    summary: {
      totalGross:       rows.reduce((s, r) => s + n(r.gross_amount),     0),
      totalNet:         rows.reduce((s, r) => s + n(r.net_amount),       0),
      totalCollected:   rows.reduce((s, r) => s + n(r.amount_collected), 0),
      totalRemaining:   rows.reduce((s, r) => s + n(r.remaining),        0),
      totalPatients:    rows.reduce((s, r) => s + n(r.patient_count),    0),
      totalTransactions: rows.reduce((s, r) => s + n(r.tx_count),        0),
    },
  };
}

// ─── 8. Amendment ────────────────────────────────────────────────────────────

async function amendment(p: ReportParams) {
  const bf = branchFragment(p.branchCodes, 3);
  const baseArgs: unknown[] = [p.dateFrom, p.dateTo, ...bf.args];

  const countSql = `
    SELECT COUNT(*) AS cnt FROM transactions t JOIN queue q ON q.id = t.idqueue
    WHERE t.date BETWEEN $1 AND $2
      AND t.origamount IS NOT NULL
      ${bf.sql}
  `;
  const rowSql = `
    SELECT t.id, t.date, q.code AS queue_code, q.accessionno,
      q.qfullname AS patient_name, t.codeitemprice AS item_code,
      t.descriptionitemprice AS item_description,
      t.origamount AS original_amount, t.amountitemprice AS new_amount,
      (t.origamount - t.amountitemprice) AS difference,
      t.namecompany AS company, t.inputby AS modified_by, t.status
    FROM transactions t JOIN queue q ON q.id = t.idqueue
    WHERE t.date BETWEEN $1 AND $2
      AND t.origamount IS NOT NULL
      ${bf.sql}
    ORDER BY t.date DESC, t.id ASC
    LIMIT $${baseArgs.length + 1} OFFSET $${baseArgs.length + 2}
  `;
  const sumSql = `
    SELECT SUM(t.origamount - t.amountitemprice) AS total_diff
    FROM transactions t JOIN queue q ON q.id = t.idqueue
    WHERE t.date BETWEEN $1 AND $2
      AND t.origamount IS NOT NULL
      ${bf.sql}
  `;

  const [countRows, dataRows, sumRows] = await Promise.all([
    prisma.$queryRawUnsafe<Array<{ cnt: bigint }>>(countSql, ...baseArgs),
    prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(rowSql, ...baseArgs, p.pageSize, p.offset),
    prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(sumSql, ...baseArgs),
  ]);

  const total = n(countRows[0]?.cnt);
  const s     = sumRows[0] ?? {};

  return {
    data: dataRows.map((r) => ({
      id:              n(r.id),
      date:            strVal(r.date).slice(0, 10),
      queueCode:       strVal(r.queue_code),
      accessionNo:     strVal(r.accessionno),
      patientName:     strVal(r.patient_name),
      itemCode:        strVal(r.item_code),
      itemDescription: strVal(r.item_description),
      originalAmount:  n(r.original_amount),
      newAmount:       n(r.new_amount),
      difference:      n(r.difference),
      company:         strVal(r.company),
      modifiedBy:      strVal(r.modified_by),
      status:          n(r.status),
    })),
    total,
    page: p.page,
    pageSize: p.pageSize,
    totalPages: Math.ceil(total / p.pageSize),
    summary: {
      totalAmendments: total,
      totalDifference: n(s.total_diff),
    },
  };
}
