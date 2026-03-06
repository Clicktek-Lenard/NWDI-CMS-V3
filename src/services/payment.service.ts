// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck — legacy service, pending rewrite for real DB schema
import prisma from "@/lib/db/prisma";
import type { PaginatedResponse, Payment, PaymentStatus } from "@/types";

export class PaymentService {
  /**
   * Get payments with pagination and filters.
   */
  static async getPayments(
    clinicCode: string,
    page = 1,
    pageSize = 50,
    filters?: { status?: PaymentStatus; dateFrom?: Date; dateTo?: Date }
  ): Promise<PaginatedResponse<Payment>> {
    const where = {
      clinic_code: clinicCode,
      ...(filters?.status && { status: filters.status }),
      ...(filters?.dateFrom && {
        created_at: {
          gte: filters.dateFrom,
          ...(filters.dateTo && { lte: filters.dateTo }),
        },
      }),
    };

    const [data, total] = await Promise.all([
      prisma.paymentHistory.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.paymentHistory.count({ where }),
    ]);

    return {
      data: data.map((row) => ({
        id: row.id,
        patientId: row.patient_id,
        queueId: row.queue_id || 0,
        amount: Number(row.amount),
        paymentMethod: row.payment_method || "",
        status: row.status as PaymentStatus,
        transactionNo: row.transaction_no || "",
        orNo: row.or_no || "",
        createdAt: row.created_at.toISOString(),
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Create a payment record.
   */
  static async createPayment(input: {
    patientId: string;
    queueId?: number;
    amount: number;
    paymentMethod: string;
    transactionNo: string;
    orNo?: string;
    clinicCode: string;
    createdBy: number;
  }) {
    return prisma.paymentHistory.create({
      data: {
        patient_id: input.patientId,
        queue_id: input.queueId,
        amount: input.amount,
        payment_method: input.paymentMethod,
        status: "PAID",
        transaction_no: input.transactionNo,
        or_no: input.orNo,
        clinic_code: input.clinicCode,
        created_by: input.createdBy,
      },
    });
  }

  /**
   * Update payment status.
   */
  static async updateStatus(id: number, status: PaymentStatus) {
    return prisma.paymentHistory.update({
      where: { id },
      data: { status },
    });
  }
}
