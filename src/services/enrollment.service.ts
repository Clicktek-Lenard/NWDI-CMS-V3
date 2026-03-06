// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck — legacy service, pending rewrite for real DB schema
import prisma from "@/lib/db/prisma";
import type { CardStatus, PaginatedResponse, CardEnrollment } from "@/types";

export class EnrollmentService {
  /**
   * Get card enrollments with pagination.
   */
  static async getEnrollments(
    clinicCode: string,
    page = 1,
    pageSize = 50,
    status?: CardStatus
  ): Promise<PaginatedResponse<CardEnrollment>> {
    const where = {
      clinic_code: clinicCode,
      ...(status && { status }),
    };

    const [data, total] = await Promise.all([
      prisma.cardEnrollment.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.cardEnrollment.count({ where }),
    ]);

    return {
      data: data.map((row) => ({
        id: row.id,
        cardNumber: row.card_number,
        patientId: row.patient_id,
        status: row.status as CardStatus,
        registeredBy: row.registered_by || "",
        registeredAt: row.registered_at.toISOString(),
        receivedBy: row.received_by || undefined,
        receivedAt: row.received_at?.toISOString(),
        verifiedBy: row.verified_by || undefined,
        verifiedAt: row.verified_at?.toISOString(),
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Register a new card.
   */
  static async registerCard(input: {
    cardNumber: string;
    patientId: string;
    patientName: string;
    registeredBy: string;
    clinicCode: string;
  }) {
    return prisma.cardEnrollment.create({
      data: {
        card_number: input.cardNumber,
        patient_id: input.patientId,
        patient_name: input.patientName,
        status: "REGISTERED",
        registered_by: input.registeredBy,
        clinic_code: input.clinicCode,
      },
    });
  }

  /**
   * Mark card as received.
   */
  static async receiveCard(id: number, receivedBy: string) {
    return prisma.cardEnrollment.update({
      where: { id },
      data: {
        status: "RECEIVED",
        received_by: receivedBy,
        received_at: new Date(),
      },
    });
  }

  /**
   * Verify a card.
   */
  static async verifyCard(id: number, verifiedBy: string) {
    return prisma.cardEnrollment.update({
      where: { id },
      data: {
        status: "VERIFIED",
        verified_by: verifiedBy,
        verified_at: new Date(),
      },
    });
  }

  /**
   * Transfer a card.
   */
  static async transferCard(id: number, transferTo: string) {
    return prisma.cardEnrollment.update({
      where: { id },
      data: {
        status: "TRANSFERRED",
        transferred_to: transferTo,
        transferred_at: new Date(),
      },
    });
  }
}
