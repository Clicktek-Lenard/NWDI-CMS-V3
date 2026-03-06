// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck — legacy service, pending rewrite for real DB schema
import prisma from "@/lib/db/prisma";
import type { QueueStatus, PaginatedResponse, QueueEntry } from "@/types";

export class QueueService {
  /**
   * Get today's queue for a specific clinic, with pagination.
   */
  static async getTodaysQueue(
    clinicCode: string,
    page = 1,
    pageSize = 50,
    status?: QueueStatus
  ): Promise<PaginatedResponse<QueueEntry>> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const where = {
      clinic_code: clinicCode,
      created_at: { gte: today },
      ...(status && { status }),
    };

    const [data, total] = await Promise.all([
      prisma.queue.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.queue.count({ where }),
    ]);

    return {
      data: data.map(mapQueueEntry),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Add a patient to the queue.
   */
  static async addToQueue(input: {
    patientId: string;
    patientName: string;
    companyCode?: string;
    companyName?: string;
    clinicCode: string;
    createdBy: number;
  }) {
    // Get next queue number for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastQueue = await prisma.queue.findFirst({
      where: {
        clinic_code: input.clinicCode,
        created_at: { gte: today },
      },
      orderBy: { queue_number: "desc" },
    });

    const nextNumber = (lastQueue?.queue_number ?? 0) + 1;

    return prisma.queue.create({
      data: {
        patient_id: input.patientId,
        patient_name: input.patientName,
        company_code: input.companyCode,
        company_name: input.companyName,
        queue_number: nextNumber,
        status: "WAITING",
        clinic_code: input.clinicCode,
        created_by: input.createdBy,
      },
    });
  }

  /**
   * Update queue entry status.
   */
  static async updateStatus(id: number, status: QueueStatus) {
    return prisma.queue.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Get queue statistics for today.
   */
  static async getStats(clinicCode: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const baseWhere = {
      clinic_code: clinicCode,
      created_at: { gte: today },
    };

    const [waiting, inProgress, completed, total] = await Promise.all([
      prisma.queue.count({ where: { ...baseWhere, status: "WAITING" } }),
      prisma.queue.count({ where: { ...baseWhere, status: "IN_PROGRESS" } }),
      prisma.queue.count({ where: { ...baseWhere, status: "COMPLETED" } }),
      prisma.queue.count({ where: baseWhere }),
    ]);

    return { waiting, inProgress, completed, total };
  }
}

function mapQueueEntry(row: {
  id: number;
  patient_id: string;
  patient_name: string;
  company_code: string | null;
  company_name: string | null;
  status: string;
  queue_number: number;
  priority: number;
  created_at: Date;
  updated_at: Date;
}): QueueEntry {
  return {
    id: row.id,
    patientId: row.patient_id,
    patientName: row.patient_name,
    companyCode: row.company_code || "",
    companyName: row.company_name || "",
    status: row.status as QueueStatus,
    queueNumber: row.queue_number,
    priorityLevel: row.priority,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}
