import { z } from "zod";

export const createAppointmentSchema = z.object({
  idPatient:       z.number().int().positive("Patient ID is required"),
  patientName:     z.string().min(1, "Patient name is required"),
  idPhysician:     z.number().int().positive("Physician ID is required"),
  physicianName:   z.string().min(1, "Physician name is required"),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  timeSlot:        z.string().min(1, "Time slot is required"),
  notes:           z.string().max(2000).optional(),
});

export const updateAppointmentSchema = z.object({
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  timeSlot:        z.string().min(1).optional(),
  notes:           z.string().max(2000).optional(),
  status:          z.number().int().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
