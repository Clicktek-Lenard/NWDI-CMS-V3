// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck — legacy service, pending rewrite for real DB schema
import prisma from "@/lib/db/prisma";
import type { QueueEntry, PaginatedResponse } from "@/types";

export interface TransactionItem {
  idCompany:            number;
  nameCompany:          string;
  idDoctor:             number | null;
  nameDoctor:           string;
  transactionType:      string;
  idItemPrice:          number;
  codeItemPrice:        string;
  descriptionItemPrice: string;
  priceGroupItemPrice:  string;
  amountItemPrice:      number;
  readersFee:           number;
  origAmount:           number;
  groupItemMaster:      string;
}

export interface CreateQueueInput {
  clinicCode:   string;
  idPatient:    number;
  fullName:     string;
  lastName:     string;
  firstName:    string;
  middleName:   string;
  gender:       string;
  dob:          string | null;   // "YYYY-MM-DD"
  patientType?: string;
  inputBy:      string;          // username
  notes?:       string;
  priority?:    number;          // 0=Regular, 1=Priority, 4=VIP
  medication?:  string;
  lastDose?:    string;          // ISO datetime string
  lastPeriod?:  string;          // "YYYY-MM-DD"
  transactions?: TransactionItem[];
}

export class QueueService {
  /**
   * Create a new queue entry — mirrors PHP QueueController::store().
   * Code format: {clinicCode}{YYYYMMDD}{4-digit-seq}  e.g. CEN202602260001
   * Initial status = 201 (first queuestatus Id for the clinic).
   */
  static async createQueue(input: CreateQueueInput): Promise<QueueEntry> {
    const {
      clinicCode,
      idPatient,
      fullName,
      lastName,
      firstName,
      middleName,
      gender,
      dob,
      patientType   = "OUT-PATIENT",
      inputBy,
      notes       = "",
      medication  = "",
      lastDose,
      lastPeriod,
      transactions = [],
    } = input;

    // Build Manila-calendar date anchors (same pattern as getTodaysQueue)
    const todayStr = new Date().toLocaleDateString("en-CA"); // "YYYY-MM-DD"
    const today    = new Date(`${todayStr}T00:00:00+08:00`);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    // YYYYMMDD suffix for code
    const datePart = todayStr.replace(/-/g, ""); // "20260226"

    // Count existing queue entries for this clinic today to generate seq
    const [count, queueStatuses] = await Promise.all([
      prisma.queue.count({
        where: { Date: { gte: today, lt: tomorrow }, IdBU: clinicCode },
      }),
      prisma.queuestatus.findMany({ where: { IdBU: { not: 0 } } }),
    ]);

    const seq = String(count + 1).padStart(4, "0");
    const code = `${clinicCode}${datePart}${seq}`;

    // Initial status — use the lowest Id status available
    const initialStatus = queueStatuses.length > 0
      ? Math.min(...queueStatuses.map((s) => s.Id))
      : 201;

    // Compute age from DOB
    let age: number | null = null;
    if (dob) {
      const birth = new Date(dob);
      const now = new Date();
      age = now.getFullYear() - birth.getFullYear();
      const mDiff = now.getMonth() - birth.getMonth();
      if (mDiff < 0 || (mDiff === 0 && now.getDate() < birth.getDate())) {
        age -= 1;
      }
    }

    // Date/time in Manila (UTC+8) — store as Manila local time
    const nowUtc = new Date();

    const created = await prisma.queue.create({
      data: {
        IdBU: clinicCode,
        Code: code,
        Date: today,
        DateTime: nowUtc,
        IdPatient: BigInt(idPatient),
        QFullName: fullName,
        QLastName: lastName,
        QFirstName: firstName,
        QMiddleName: middleName,
        QGender: gender,
        QDOB: dob ? new Date(`${dob}T00:00:00Z`) : null,
        AgePatient: age,
        Status: initialStatus,
        AnteDateStatus: 0,
        AccessionNo: code,
        PatientType: patientType,
        Notes: notes || null,
        InputBy: inputBy.slice(0, 30),
      },
    });

    const queueId = created.Id;

    // ── Vitals (optional) ──────────────────────────────────────
    if (medication || lastDose || lastPeriod) {
      await prisma.vitals.create({
        data: {
          IdQueue:       queueId,
          Medication:    medication || null,
          LastDose:      lastDose ? new Date(lastDose) : null,
          LastPeriod:    lastPeriod ? new Date(`${lastPeriod}T00:00:00Z`) : null,
          InputBy:       inputBy.slice(0, 30),
          InputDateTime: nowUtc,
        },
      });
    }

    // ── Transaction items ──────────────────────────────────────
    if (transactions.length > 0) {
      await prisma.transactions.createMany({
        data: transactions.map((tx) => ({
          IdQueue:              queueId,
          Date:                 today,
          IdDoctor:             tx.idDoctor ? BigInt(tx.idDoctor) : null,
          NameDoctor:           tx.nameDoctor || null,
          IdCompany:            tx.idCompany,
          NameCompany:          tx.nameCompany,
          TransactionType:      tx.transactionType || null,
          IdItemPrice:          BigInt(tx.idItemPrice),
          CodeItemPrice:        tx.codeItemPrice,
          DescriptionItemPrice: tx.descriptionItemPrice,
          PriceGroupItemPrice:  tx.priceGroupItemPrice || "Item",
          AmountItemPrice:      tx.amountItemPrice,
          AmountRemaining:      tx.amountItemPrice,
          ReadersFee:           tx.readersFee,
          OrigAmount:           tx.origAmount,
          GroupItemMaster:      tx.groupItemMaster || null,
          InputBy:              inputBy.slice(0, 30),
          Status:               201,
        })),
      });
    }

    const statusMap = new Map<number, string>();
    for (const s of queueStatuses) {
      statusMap.set(s.Id, s.Name ?? "");
    }

    return mapQueueEntry(created, count + 1, statusMap);
  }

  /**
   * Get today's queue for a clinic.
   * Mirrors the existing CMS todaysQueue() logic:
   *   - Filtered by Date = today and IdBU = clinicCode
   *   - Status name resolved via queuestatus lookup table
   */
  /**
   * Generate the next queue code for a clinic on today's date.
   * Returns both the code and the anchored UTC-midnight "today" Date for reuse.
   */
  static async generateQueueCode(
    clinicCode: string
  ): Promise<{ code: string; today: Date }> {
    const todayStr = new Date().toLocaleDateString("en-CA");
    const today    = new Date(`${todayStr}T00:00:00+08:00`);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const datePart = todayStr.replace(/-/g, "");
    const count = await prisma.queue.count({
      where: { Date: { gte: today, lt: tomorrow }, IdBU: clinicCode },
    });
    const seq  = String(count + 1).padStart(4, "0");
    const code = `${clinicCode}${datePart}${seq}`;
    return { code, today };
  }

  static async getTodaysQueue(
    clinicCode: string,
    page = 1,
    pageSize = 200,
    statusFilter?: string
  ): Promise<PaginatedResponse<QueueEntry> & { stats: Record<string, number> }> {
    // queue.Date is a MySQL DATE column (@db.Date).
    // Prisma serializes Date objects using the UTC date portion, so we
    // anchor both boundaries to UTC midnight of the Manila calendar date.
    const todayStr = new Date().toLocaleDateString("en-CA"); // "YYYY-MM-DD" (TZ=Asia/Manila)
    const today    = new Date(`${todayStr}T00:00:00+08:00`);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const where = {
      Date: { gte: today, lt: tomorrow },
      IdBU: clinicCode,
    };
    // Fetch queue statuses (small lookup table) and today's entries in parallel
    const [queueStatuses, entries] = await Promise.all([
      prisma.queuestatus.findMany(),
      prisma.queue.findMany({
        where,
        orderBy: { Id: "asc" },
      }),
    ]);

    // Build status ID → name map
    const statusMap = new Map<number, string>();
    for (const qs of queueStatuses) {
      statusMap.set(qs.Id, qs.Name ?? "");
    }

    // Map all entries to QueueEntry
    const allData = entries.map((q, i) => mapQueueEntry(q, i + 1, statusMap));

    // Compute stats from all entries (before status filter)
    const stats: Record<string, number> = { total: allData.length };
    for (const q of allData) {
      stats[q.statusName] = (stats[q.statusName] ?? 0) + 1;
    }

    // Apply optional status filter
    const filtered = statusFilter
      ? allData.filter((q) => q.statusName === statusFilter)
      : allData;

    // Apply pagination
    const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

    return {
      data: paged,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
      stats,
    };
  }

  /**
   * Past Queue — historical records (Date < today).
   * Mirrors old CMS Queue::pastQueue() logic exactly:
   * - All queues where Date < today for the clinic, no status restriction.
   * - Optional patient name search (QFullName contains).
   * - Limit: 1000 records, ordered by Date DESC.
   */
  static async getPastQueue(
    clinicCode: string,
    options: {
      q?:         string;   // patient name search
      dateFrom?:  string;   // "YYYY-MM-DD"
      dateTo?:    string;   // "YYYY-MM-DD"
      status?:    string;   // status name filter (client-side)
      page?:      number;
      pageSize?:  number;
    } = {}
  ): Promise<PaginatedResponse<QueueEntry & { date: string }>> {
    const { q, dateFrom, dateTo, status, page = 1, pageSize = 100 } = options;

    const todayStr = new Date().toLocaleDateString("en-CA"); // "YYYY-MM-DD" Manila
    const today    = new Date(`${todayStr}T00:00:00Z`);

    const dateFilter: Record<string, Date> = { lt: today };
    if (dateFrom) dateFilter.gte = new Date(`${dateFrom}T00:00:00Z`);
    if (dateTo)   dateFilter.lt  = new Date(`${dateTo}T00:00:00Z`);

    const [queueStatuses, entries] = await Promise.all([
      prisma.queuestatus.findMany(),
      prisma.queue.findMany({
        where: {
          Date: dateFilter,
          IdBU: clinicCode,
          ...(q ? { QFullName: { contains: q } } : {}),
        },
        orderBy: { Date: "desc" },
        take: 1000,
      }),
    ]);

    const statusMap = new Map<number, string>();
    for (const qs of queueStatuses) statusMap.set(qs.Id, qs.Name ?? "");

    const allData = entries.map((queue, i) => ({
      ...mapQueueEntry(queue, i + 1, statusMap),
      date: queue.Date.toISOString().split("T")[0],
    }));

    const filtered = status
      ? allData.filter((q) => q.statusName === status)
      : allData;

    const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

    return {
      data: paged,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  }
}

function mapQueueEntry(
  q: {
    Id: bigint;
    Code: string | null;
    DateTime: Date;
    Date: Date;
    IdBU: string | null;
    IdPatient: bigint;
    QFullName: string | null;
    QLastName: string | null;
    QFirstName: string | null;
    QMiddleName: string | null;
    QGender: string | null;
    AgePatient: number | null;
    Status: number;
    AccessionNo: string | null;
    PatientType: string | null;
    InputBy: string | null;
    Notes?: string | null;
  },
  rowNumber: number,
  statusMap: Map<number, string>
): QueueEntry {
  const firstName = q.QFirstName?.trim() ?? "";
  const lastName = q.QLastName?.trim() ?? "";
  const middleName = q.QMiddleName?.trim() ?? "";

  const patientName =
    q.QFullName?.trim() ||
    [lastName, [firstName, middleName].filter(Boolean).join(" ")]
      .filter(Boolean)
      .join(", ");

  return {
    id: Number(q.Id),
    code: q.Code ?? "",
    rowNumber,
    idPatient: Number(q.IdPatient),
    patientName,
    accessionNo: q.AccessionNo ?? "",
    statusCode: q.Status,
    statusName: statusMap.get(q.Status) ?? "Unknown",
    patientType: q.PatientType ?? "",
    inputBy: q.InputBy ?? "",
    notes: q.Notes ?? "",
    age: q.AgePatient ?? null,
    gender: q.QGender ?? "",
    queueDateTime: q.DateTime?.toISOString() ?? q.Date?.toISOString() ?? "",
  };
}
