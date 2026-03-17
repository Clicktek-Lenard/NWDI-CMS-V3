import prisma from "@/lib/db/prisma";
import type { CreateSendoutInput } from "@/lib/validators/sendout";

const SENDOUT_SENT      = 201;
const SENDOUT_RECEIVED  = 301;
const SENDOUT_COMPLETED = 501;
const SENDOUT_CANCELLED = 650;

export class SendoutService {
  /**
   * List sendouts visible to the clinic (sent from OR sent to).
   */
  static async listSendouts(
    clinicCode: string,
    filters: { status?: number; dateFrom?: string; dateTo?: string } = {}
  ) {
    const where: Record<string, unknown> = {
      OR: [{ IdBUFrom: clinicCode }, { IdBUTo: clinicCode }],
      Status: { not: SENDOUT_CANCELLED },
    };

    if (filters.status) {
      where.Status = filters.status;
    }

    if (filters.dateFrom || filters.dateTo) {
      const dateFilter: Record<string, Date> = {};
      if (filters.dateFrom) dateFilter.gte = new Date(`${filters.dateFrom}T00:00:00+08:00`);
      if (filters.dateTo)   dateFilter.lte = new Date(`${filters.dateTo}T23:59:59+08:00`);
      where.SentDate = dateFilter;
    }

    const rows = await prisma.sendout.findMany({
      where,
      orderBy: { SentDate: "desc" },
      take: 200,
    });

    return rows.map(serialize);
  }

  /**
   * Create a new sendout record.
   */
  static async createSendout(
    clinicCode: string,
    input: CreateSendoutInput,
    sentBy: string
  ) {
    const row = await prisma.sendout.create({
      data: {
        IdQueue:     BigInt(input.idQueue),
        QueueCode:   input.queueCode ?? null,
        PatientName: input.patientName ?? null,
        IdBUFrom:    clinicCode,
        IdBUTo:      input.idBUTo,
        Items:       input.items ?? null,
        Notes:       input.notes ?? null,
        Status:      SENDOUT_SENT,
        SentBy:      sentBy,
        SentDate:    new Date(),
      },
    });
    return serialize(row);
  }

  /**
   * Mark sendout as received at destination branch.
   */
  static async receiveSendout(id: number, receivedBy: string) {
    const row = await prisma.sendout.update({
      where: { Id: BigInt(id) },
      data: {
        Status:       SENDOUT_RECEIVED,
        ReceivedBy:   receivedBy,
        DateReceived: new Date(),
        UpdateBy:     receivedBy,
        UpdateDate:   new Date(),
      },
    });
    return serialize(row);
  }

  /**
   * Mark sendout as completed (results done).
   */
  static async completeSendout(id: number, completedBy: string) {
    const row = await prisma.sendout.update({
      where: { Id: BigInt(id) },
      data: {
        Status:        SENDOUT_COMPLETED,
        CompletedBy:   completedBy,
        DateCompleted: new Date(),
        UpdateBy:      completedBy,
        UpdateDate:    new Date(),
      },
    });
    return serialize(row);
  }

  /**
   * Cancel a sendout (soft-delete).
   */
  static async cancelSendout(id: number, cancelledBy: string) {
    const row = await prisma.sendout.update({
      where: { Id: BigInt(id) },
      data: {
        Status:     SENDOUT_CANCELLED,
        UpdateBy:   cancelledBy,
        UpdateDate: new Date(),
      },
    });
    return serialize(row);
  }

  /**
   * Get sendout counts for a clinic (summary cards).
   */
  static async getSummary(clinicCode: string) {
    const [pending, received, completed] = await Promise.all([
      prisma.sendout.count({
        where: { OR: [{ IdBUFrom: clinicCode }, { IdBUTo: clinicCode }], Status: SENDOUT_SENT },
      }),
      prisma.sendout.count({
        where: { OR: [{ IdBUFrom: clinicCode }, { IdBUTo: clinicCode }], Status: SENDOUT_RECEIVED },
      }),
      prisma.sendout.count({
        where: { OR: [{ IdBUFrom: clinicCode }, { IdBUTo: clinicCode }], Status: SENDOUT_COMPLETED },
      }),
    ]);

    return { pending, received, completed };
  }
}

function serialize(row: {
  Id: bigint; IdQueue: bigint; QueueCode: string | null; PatientName: string | null;
  IdBUFrom: string; IdBUTo: string; Items: string | null; Notes: string | null;
  Status: number; SentBy: string | null; SentDate: Date;
  ReceivedBy: string | null; DateReceived: Date | null;
  CompletedBy: string | null; DateCompleted: Date | null;
  UpdateBy: string | null; UpdateDate: Date | null;
}) {
  return {
    id:            Number(row.Id),
    idQueue:       Number(row.IdQueue),
    queueCode:     row.QueueCode ?? "",
    patientName:   row.PatientName ?? "",
    idBUFrom:      row.IdBUFrom,
    idBUTo:        row.IdBUTo,
    items:         row.Items ?? "",
    notes:         row.Notes ?? "",
    status:        row.Status,
    sentBy:        row.SentBy ?? "",
    sentDate:      row.SentDate.toISOString(),
    receivedBy:    row.ReceivedBy ?? "",
    dateReceived:  row.DateReceived?.toISOString() ?? null,
    completedBy:   row.CompletedBy ?? "",
    dateCompleted: row.DateCompleted?.toISOString() ?? null,
  };
}
