import prisma from "@/lib/db/prisma";
import type { CreateAppointmentInput } from "@/lib/validators/appointment";

const APPT_STATUS_BOOKED    = 201;
const APPT_STATUS_CHECKED_IN = 210;
const APPT_STATUS_CANCELLED = 650;

export class AppointmentService {
  /**
   * List appointments for a given date and clinic, optionally filtered by physician.
   */
  static async getAppointments(
    clinicCode: string,
    date: string,
    physicianId?: number
  ) {
    const where: Record<string, unknown> = {
      IdBU: clinicCode,
      AppointmentDate: new Date(`${date}T00:00:00+08:00`),
      Status: { not: APPT_STATUS_CANCELLED },
    };
    if (physicianId) {
      where.IdPhysician = BigInt(physicianId);
    }

    const rows = await prisma.appointment.findMany({
      where,
      orderBy: { TimeSlot: "asc" },
    });

    return rows.map((r) => ({
      id:              Number(r.Id),
      idPatient:       Number(r.IdPatient),
      patientName:     r.PatientName ?? "",
      idPhysician:     Number(r.IdPhysician),
      physicianName:   r.PhysicianName ?? "",
      appointmentDate: r.AppointmentDate.toISOString().slice(0, 10),
      timeSlot:        r.TimeSlot ?? "",
      notes:           r.Notes ?? "",
      idQueue:         r.IdQueue ? Number(r.IdQueue) : null,
      status:          r.Status,
      inputBy:         r.InputBy ?? "",
      inputDateTime:   r.InputDateTime.toISOString(),
    }));
  }

  /**
   * Get upcoming appointments (today + future) for a clinic.
   */
  static async getUpcoming(clinicCode: string, limit = 50) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rows = await prisma.appointment.findMany({
      where: {
        IdBU: clinicCode,
        AppointmentDate: { gte: today },
        Status: { not: APPT_STATUS_CANCELLED },
      },
      orderBy: [{ AppointmentDate: "asc" }, { TimeSlot: "asc" }],
      take: limit,
    });

    return rows.map((r) => ({
      id:              Number(r.Id),
      idPatient:       Number(r.IdPatient),
      patientName:     r.PatientName ?? "",
      idPhysician:     Number(r.IdPhysician),
      physicianName:   r.PhysicianName ?? "",
      appointmentDate: r.AppointmentDate.toISOString().slice(0, 10),
      timeSlot:        r.TimeSlot ?? "",
      notes:           r.Notes ?? "",
      idQueue:         r.IdQueue ? Number(r.IdQueue) : null,
      status:          r.Status,
    }));
  }

  /**
   * Book a new appointment with conflict detection.
   */
  static async createAppointment(
    clinicCode: string,
    input: CreateAppointmentInput,
    inputBy: string
  ) {
    // Check for conflict: same physician, same date, same time slot, not cancelled
    const conflict = await prisma.appointment.findFirst({
      where: {
        IdBU:            clinicCode,
        IdPhysician:     BigInt(input.idPhysician),
        AppointmentDate: new Date(`${input.appointmentDate}T00:00:00+08:00`),
        TimeSlot:        input.timeSlot,
        Status:          { not: APPT_STATUS_CANCELLED },
      },
    });

    if (conflict) {
      return { error: "Time slot already booked for this physician", conflict: true };
    }

    const row = await prisma.appointment.create({
      data: {
        IdBU:            clinicCode,
        IdPatient:       BigInt(input.idPatient),
        PatientName:     input.patientName,
        IdPhysician:     BigInt(input.idPhysician),
        PhysicianName:   input.physicianName,
        AppointmentDate: new Date(`${input.appointmentDate}T00:00:00+08:00`),
        TimeSlot:        input.timeSlot,
        Notes:           input.notes ?? null,
        Status:          APPT_STATUS_BOOKED,
        InputBy:         inputBy,
        InputDateTime:   new Date(),
      },
    });

    return {
      id:              Number(row.Id),
      idPatient:       Number(row.IdPatient),
      patientName:     row.PatientName ?? "",
      idPhysician:     Number(row.IdPhysician),
      physicianName:   row.PhysicianName ?? "",
      appointmentDate: row.AppointmentDate.toISOString().slice(0, 10),
      timeSlot:        row.TimeSlot ?? "",
      notes:           row.Notes ?? "",
      status:          row.Status,
    };
  }

  /**
   * Cancel an appointment (soft-delete).
   */
  static async cancelAppointment(id: number, cancelledBy: string) {
    const row = await prisma.appointment.update({
      where: { Id: BigInt(id) },
      data: {
        Status:         APPT_STATUS_CANCELLED,
        UpdateBy:       cancelledBy,
        UpdateDateTime: new Date(),
      },
    });
    return { id: Number(row.Id), status: row.Status };
  }

  /**
   * Link appointment to a queue entry on check-in day.
   */
  static async checkIn(id: number, queueId: number, updatedBy: string) {
    const row = await prisma.appointment.update({
      where: { Id: BigInt(id) },
      data: {
        IdQueue:        BigInt(queueId),
        Status:         APPT_STATUS_CHECKED_IN,
        UpdateBy:       updatedBy,
        UpdateDateTime: new Date(),
      },
    });
    return { id: Number(row.Id), idQueue: Number(row.IdQueue), status: row.Status };
  }

  /**
   * Get physician availability for a date.
   * Reads physician schedule fields and subtracts already-booked slots.
   */
  static async getPhysicianAvailability(
    clinicCode: string,
    physicianId: number,
    date: string
  ) {
    const physician = await prisma.physician.findFirst({
      where: { Id: BigInt(physicianId) },
      select: {
        Id:          true,
        FullName:    true,
        Schedule:    true,
        TimeStart:   true,
        TimeEnd:     true,
        ByAppointment: true,
      },
    });

    if (!physician) {
      return { error: "Physician not found" };
    }

    // Generate 30-minute slots between TimeStart and TimeEnd
    const startTime = physician.TimeStart || "08:00";
    const endTime   = physician.TimeEnd   || "17:00";
    const allSlots  = generateTimeSlots(startTime, endTime, 30);

    // Find already-booked slots for this physician on this date
    const booked = await prisma.appointment.findMany({
      where: {
        IdBU:            clinicCode,
        IdPhysician:     BigInt(physicianId),
        AppointmentDate: new Date(`${date}T00:00:00+08:00`),
        Status:          { not: APPT_STATUS_CANCELLED },
      },
      select: { TimeSlot: true },
    });

    const bookedSet = new Set(booked.map((b) => b.TimeSlot));

    const slots = allSlots.map((slot) => ({
      time:     slot,
      available: !bookedSet.has(slot),
    }));

    return {
      physicianId:   Number(physician.Id),
      physicianName: physician.FullName ?? "",
      date,
      schedule:      physician.Schedule ?? "",
      byAppointment: physician.ByAppointment ?? "",
      slots,
    };
  }
}

/**
 * Generate time slots between start and end at given interval (minutes).
 * E.g. generateTimeSlots("08:00", "12:00", 30) → ["08:00", "08:30", "09:00", ...]
 */
function generateTimeSlots(start: string, end: string, intervalMinutes: number): string[] {
  const slots: string[] = [];
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  let current = sh * 60 + sm;
  const endMin = eh * 60 + em;

  while (current < endMin) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    current += intervalMinutes;
  }

  return slots;
}
