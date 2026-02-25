import { z } from "zod";

export const createPaymentSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  queueId: z.number().optional(),
  amount: z.number().positive("Amount must be positive"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  transactionNo: z.string().min(1, "Transaction number is required"),
  orNo: z.string().optional(),
});

export const updatePaymentStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "CANCELLED", "REFUNDED"]),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>;
