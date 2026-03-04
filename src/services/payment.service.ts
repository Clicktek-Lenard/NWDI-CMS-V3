import type { PaginatedResponse, Payment, PaymentStatus } from "@/types";

// NOTE: paymentHistory table does not exist in the current PostgreSQL database.
// These methods are stubs until the table is created.

export class PaymentService {
  static async getPayments(
    _clinicCode: string,
    _page = 1,
    _pageSize = 50,
    _filters?: { status?: PaymentStatus; dateFrom?: Date; dateTo?: Date }
  ): Promise<PaginatedResponse<Payment>> {
    throw new Error("PaymentService: paymentHistory table not yet available");
  }

  static async createPayment(_input: {
    patientId: string;
    queueId?: number;
    amount: number;
    paymentMethod: string;
    transactionNo: string;
    orNo?: string;
    clinicCode: string;
    createdBy: number;
  }) {
    throw new Error("PaymentService: paymentHistory table not yet available");
  }

  static async updateStatus(_id: number, _status: PaymentStatus) {
    throw new Error("PaymentService: paymentHistory table not yet available");
  }
}
