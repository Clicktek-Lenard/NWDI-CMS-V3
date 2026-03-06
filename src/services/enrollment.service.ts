import type { CardStatus, PaginatedResponse, CardEnrollment } from "@/types";

// NOTE: cardEnrollment table does not exist in the current PostgreSQL database.
// These methods are stubs until the table is created.

export class EnrollmentService {
  static async getEnrollments(
    _clinicCode: string,
    _page = 1,
    _pageSize = 50,
    _status?: CardStatus
  ): Promise<PaginatedResponse<CardEnrollment>> {
    throw new Error("EnrollmentService: cardEnrollment table not yet available");
  }

  static async registerCard(_input: {
    cardNumber: string;
    patientId: string;
    patientName: string;
    registeredBy: string;
    clinicCode: string;
  }) {
    throw new Error("EnrollmentService: cardEnrollment table not yet available");
  }

  static async receiveCard(_id: number, _receivedBy: string) {
    throw new Error("EnrollmentService: cardEnrollment table not yet available");
  }

  static async verifyCard(_id: number, _verifiedBy: string) {
    throw new Error("EnrollmentService: cardEnrollment table not yet available");
  }

  static async transferCard(_id: number, _transferTo: string) {
    throw new Error("EnrollmentService: cardEnrollment table not yet available");
  }
}
