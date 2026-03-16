/**
 * Accession Number Assignment Service
 *
 * Mirrors PHP CMS v1 makeAccessionNo() — with one critical constraint preserved:
 *
 *   THIS FUNCTION MUST NEVER BE CALLED AUTOMATICALLY OR FROM A SCHEDULER.
 *
 * The physical specimen must be collected before accession numbers are assigned.
 * The human operator confirms this by pressing "Assign Accession No." in the
 * queue toolbar.  One queue per press, newest-first.
 *
 * Processing rules
 * ──────────────────────────────────────────────────────────────────────────────
 *  Eligible queue: IdBU = clinicCode, Date = today, Status = 300
 *  One queue at a time (ORDER BY Id DESC LIMIT 1)
 *
 *  LAB   → grouped by IdDoctor + IdCompany
 *            Reuse if same doctor/company already has an accession today
 *            (accessionno.status 260–650); else QueueCode + A … L
 *
 *  IMAGING → grouped by IdDoctor + IdCompany + IdTransaction + ItemCode
 *              Only rows where AccessionNo IS NULL
 *              QueueCode + M … X  (offset by existing IMAGING accessions today
 *              with status 260–900 so letters never collide across queues)
 *
 *  After assignment:
 *    accessionno rows  → Status 360
 *    transactions      → Status 360  (non-cancelled)
 *    queue             → Status 360
 */

import prisma from "@/lib/db/prisma";

// Alpha suffixes ─ LAB: A–L (indices 0–11) · IMAGING: M–X (indices 12–23)
const LAB_ALPHA = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"] as const;
const IMG_ALPHA = ["M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X"] as const;

export interface AccessionResult {
  queueId: number;
  queueCode: string;
  assigned: Array<{ accessionNo: string; type: string; count: number }>;
  skipped: number;
}

export async function makeAccessionNo(
  clinicCode: string,
  updatedBy: string,
): Promise<AccessionResult | null> {
  // TZ = Asia/Manila via cross-env in npm scripts
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  // ── 1. Next eligible queue ────────────────────────────────────────────────
  const queue = await prisma.queue.findFirst({
    where: {
      IdBU: clinicCode,
      Date: { gte: todayStart, lt: todayEnd },
      Status: 300,
    },
    orderBy: { Id: "desc" },
  });

  if (!queue) return null;

  const queueId = queue.Id;
  const queueCode = queue.Code ?? "";

  // ── 2. Ensure accessionno rows exist for this queue ───────────────────────
  // CMS v3 queues may not have rows yet — seed them from transactions on first
  // call so the rest of the logic has rows to work with.
  const txs = await prisma.transactions.findMany({
    where: { IdQueue: queueId, Status: { lt: 650 } },
  });

  // Get the set of transaction IDs that already have a row
  const existingIds = new Set(
    (
      await prisma.accessionno.findMany({
        where: { IdQueue: queueId },
        select: { Id: true },
      })
    ).map((r) => r.Id.toString()),
  );

  // Batch-resolve LAB vs IMAGING type from itemmaster for any new transactions.
  // GroupItemMaster can be "PACK" for packages — itemmaster.Type is authoritative.
  const newTxs = txs.filter((t) => !existingIds.has(t.Id.toString()));

  const itemCodes = [...new Set(newTxs.map((t) => t.CodeItemPrice).filter(Boolean))] as string[];
  const itemTypeMap = new Map<string, string>();
  if (itemCodes.length > 0) {
    const items = await prisma.itemmaster.findMany({
      where: { Code: { in: itemCodes } },
      select: { Code: true, Type: true },
    });
    for (const item of items) {
      if (item.Code) itemTypeMap.set(item.Code, item.Type ?? "LAB");
    }
  }

  for (const t of newTxs) {
    // Resolve type: itemmaster.Type preferred; fall back to GroupItemMaster if it's
    // already LAB/IMAGING; otherwise default to LAB (packages are almost always lab).
    const rawGroup = (t.GroupItemMaster ?? "").toUpperCase();
    const itemType = itemTypeMap.get(t.CodeItemPrice ?? "");
    const resolvedType =
      (itemType === "LAB" || itemType === "IMAGING" ? itemType : null) ??
      (rawGroup === "LAB" || rawGroup === "IMAGING" ? rawGroup : "LAB");

    await prisma.accessionno.create({
      data: {
        Id: t.Id,
        IdBU: clinicCode,
        Date: queue.Date,
        QueueCode: queueCode,
        IdTransaction: t.Id,
        AccessionNo: null,
        IdQueue: queueId,
        IdCompany: t.IdCompany ?? 0,
        IdDoctor: Number(t.IdDoctor ?? 0),
        ItemCode: t.CodeItemPrice,
        ItemDescription: t.DescriptionItemPrice,
        ItemGroup: t.GroupItemMaster,
        ItemSubGroup: t.GroupItemMaster,
        Type: resolvedType,
        SystemTimeCreated: now,
        SystemUpdateTime: now,
      },
    });
  }

  // ── 3. Load all accessionno rows for this queue ───────────────────────────
  const allRows = await prisma.accessionno.findMany({
    where: { IdQueue: queueId },
  });

  // Repair any pre-existing rows that have Type = "PACK" or other non-LAB/IMAGING
  // values (e.g. rows seeded before this fix, or rows seeded by legacy processes).
  const staleRows = allRows.filter((r) => r.Type !== "LAB" && r.Type !== "IMAGING");
  if (staleRows.length > 0) {
    const staleCodes = [...new Set(staleRows.map((r) => r.ItemCode).filter(Boolean))] as string[];
    const staleItems = staleCodes.length > 0
      ? await prisma.itemmaster.findMany({ where: { Code: { in: staleCodes } }, select: { Code: true, Type: true } })
      : [];
    const staleTypeMap = new Map(staleItems.map((i) => [i.Code!, i.Type ?? null]));

    for (const row of staleRows) {
      const rawGroup = (row.ItemGroup ?? "").toUpperCase();
      const itemType = staleTypeMap.get(row.ItemCode ?? "");
      const corrected =
        (itemType === "LAB" || itemType === "IMAGING" ? itemType : null) ??
        (rawGroup === "LAB" || rawGroup === "IMAGING" ? rawGroup : "LAB");
      if (corrected !== row.Type) {
        await prisma.accessionno.updateMany({
          where: { Id: row.Id },
          data: { Type: corrected, SystemUpdateTime: now },
        });
        row.Type = corrected; // update in-memory so labRows/imgRows picks it up
      }
    }
  }

  const labRows = allRows.filter((r) => r.Type === "LAB");
  const imgRows = allRows.filter((r) => r.Type === "IMAGING" && !r.AccessionNo);
  const skipped = allRows.length - labRows.length - imgRows.length;

  const assignedResult: AccessionResult["assigned"] = [];

  // ── 4a. LAB: group by IdDoctor | IdCompany ────────────────────────────────
  const labGroups = new Map<string, typeof labRows>();
  for (const row of labRows) {
    const key = `${row.IdDoctor}|${row.IdCompany}`;
    const arr = labGroups.get(key) ?? [];
    arr.push(row);
    labGroups.set(key, arr);
  }

  const labAssignments: Array<{
    idDoctor: number;
    idCompany: number;
    accNo: string;
    nullCount: number;
  }> = [];
  let labAlphaIdx = 0;

  for (const [key, rows] of labGroups) {
    const nullRows = rows.filter((r) => !r.AccessionNo);
    if (nullRows.length === 0) continue;

    const [idDrStr, idCoStr] = key.split("|");
    const idDoctor = Number(idDrStr);
    const idCompany = Number(idCoStr);

    // Reuse if same clinic/today/doctor/company already has an accession (260–650)
    const existing = await prisma.accessionno.findFirst({
      where: {
        IdBU: clinicCode,
        Date: { gte: todayStart, lt: todayEnd },
        IdDoctor: idDoctor,
        IdCompany: idCompany,
        Type: "LAB",
        Status: { not: null, gte: 260, lte: 650 },
        AccessionNo: { not: null },
      },
      select: { AccessionNo: true },
    });

    const accNo =
      existing?.AccessionNo ??
      `${queueCode}${LAB_ALPHA[labAlphaIdx] ?? String(labAlphaIdx)}`;

    if (!existing?.AccessionNo) labAlphaIdx++;

    labAssignments.push({ idDoctor, idCompany, accNo, nullCount: nullRows.length });
  }

  // ── 4b. IMAGING: group by IdDoctor | IdCompany | IdTransaction | ItemCode ──
  const imgGroups = new Map<string, typeof imgRows>();
  for (const row of imgRows) {
    const key = `${row.IdDoctor}|${row.IdCompany}|${String(row.IdTransaction)}|${row.ItemCode ?? ""}`;
    const arr = imgGroups.get(key) ?? [];
    arr.push(row);
    imgGroups.set(key, arr);
  }

  // Offset = count of IMAGING accessions already assigned today (status 260–900)
  const imgOffset = await prisma.accessionno.count({
    where: {
      IdBU: clinicCode,
      Date: { gte: todayStart, lt: todayEnd },
      Type: "IMAGING",
      Status: { not: null, gte: 260, lte: 900 },
      AccessionNo: { not: null },
    },
  });
  let imgAlphaIdx = imgOffset;

  const imgAssignments: Array<{
    idDoctor: number;
    idCompany: number;
    idTransaction: bigint | null;
    itemCode: string | null;
    accNo: string;
    count: number;
  }> = [];

  for (const [key, rows] of imgGroups) {
    const parts = key.split("|");
    const idDoctor = Number(parts[0]);
    const idCompany = Number(parts[1]);
    const txStr = parts[2];
    const itemCode = parts[3] === "" ? null : parts[3];
    const idTransaction =
      txStr && txStr !== "null" && txStr !== "undefined" ? BigInt(txStr) : null;

    const accNo = `${queueCode}${IMG_ALPHA[imgAlphaIdx] ?? String(imgAlphaIdx)}`;
    imgAlphaIdx++;

    imgAssignments.push({ idDoctor, idCompany, idTransaction, itemCode, accNo, count: rows.length });
  }

  if (labAssignments.length === 0 && imgAssignments.length === 0) {
    return { queueId: Number(queueId), queueCode, assigned: [], skipped };
  }

  // ── 5. Persist atomically ─────────────────────────────────────────────────
  const stamp = new Date();

  await prisma.$transaction(async (tx) => {
    // LAB: update all blank rows per doctor/company group
    // AccessionNo may be null OR "" from legacy data — match both
    for (const { idDoctor, idCompany, accNo } of labAssignments) {
      await tx.accessionno.updateMany({
        where: {
          IdQueue: queueId,
          IdDoctor: idDoctor,
          IdCompany: idCompany,
          Type: "LAB",
          OR: [{ AccessionNo: null }, { AccessionNo: "" }],
        },
        data: { AccessionNo: accNo, Status: 360, SystemUpdateTime: stamp },
      });
    }

    // IMAGING: update by exact group key (blank rows only)
    for (const { idDoctor, idCompany, idTransaction, itemCode, accNo } of imgAssignments) {
      await tx.accessionno.updateMany({
        where: {
          IdQueue: queueId,
          IdDoctor: idDoctor,
          IdCompany: idCompany,
          ...(idTransaction !== null ? { IdTransaction: idTransaction } : {}),
          ItemCode: itemCode,
          Type: "IMAGING",
          OR: [{ AccessionNo: null }, { AccessionNo: "" }],
        },
        data: { AccessionNo: accNo, Status: 360, SystemUpdateTime: stamp },
      });
    }

    // Advance all non-cancelled transactions → 360
    await tx.transactions.updateMany({
      where: { IdQueue: queueId, Status: { lt: 650 } },
      data: { Status: 360, SystemUpdateTime: stamp },
    });

    // Advance queue → 360
    await tx.queue.update({
      where: { Id: queueId },
      data: { Status: 360, UpdateBy: updatedBy, UpdateDate: stamp, SystemUpdateTime: stamp },
    });
  });

  // ── 6. Build result ───────────────────────────────────────────────────────
  for (const a of labAssignments) {
    assignedResult.push({ accessionNo: a.accNo, type: "LAB", count: a.nullCount });
  }
  for (const a of imgAssignments) {
    assignedResult.push({ accessionNo: a.accNo, type: "IMAGING", count: a.count });
  }

  return { queueId: Number(queueId), queueCode, assigned: assignedResult, skipped };
}
