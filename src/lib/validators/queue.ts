import { z } from "zod";

export const addToQueueSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  patientName: z.string().min(1, "Patient name is required"),
  companyCode: z.string().optional(),
  companyName: z.string().optional(),
  priority: z.number().int().min(0).max(1).optional(),
});

export const updateQueueStatusSchema = z.object({
  status: z.enum(["WAITING", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"]),
});

export type AddToQueueInput = z.infer<typeof addToQueueSchema>;
export type UpdateQueueStatusInput = z.infer<typeof updateQueueStatusSchema>;
