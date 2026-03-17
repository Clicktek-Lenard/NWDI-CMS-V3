import { z } from "zod";

export const createSendoutSchema = z.object({
  idQueue:     z.number().int().positive("Queue ID is required"),
  queueCode:   z.string().optional(),
  patientName: z.string().optional(),
  idBUTo:      z.string().min(1, "Destination branch is required"),
  items:       z.string().optional(),
  notes:       z.string().max(2000).optional(),
});

export type CreateSendoutInput = z.infer<typeof createSendoutSchema>;
