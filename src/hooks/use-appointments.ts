"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

const APPOINTMENTS_KEY = "appointments";

interface Appointment {
  id:              number;
  idPatient:       number;
  patientName:     string;
  idPhysician:     number;
  physicianName:   string;
  appointmentDate: string;
  timeSlot:        string;
  notes:           string;
  idQueue:         number | null;
  status:          number;
  inputBy?:        string;
  inputDateTime?:  string;
}

interface SlotInfo {
  time:      string;
  available: boolean;
}

interface AvailabilityResponse {
  physicianId:   number;
  physicianName: string;
  date:          string;
  schedule:      string;
  byAppointment: string;
  slots:         SlotInfo[];
}

/**
 * Fetch appointments for a specific date.
 */
export function useAppointments(date: string, physicianId?: number) {
  const params = new URLSearchParams({ date });
  if (physicianId) params.set("physicianId", String(physicianId));

  return useQuery<Appointment[]>({
    queryKey: [APPOINTMENTS_KEY, date, physicianId],
    queryFn: () => apiFetch<Appointment[]>(`/api/appointments?${params}`),
  });
}

/**
 * Fetch upcoming appointments.
 */
export function useUpcomingAppointments() {
  return useQuery<Appointment[]>({
    queryKey: [APPOINTMENTS_KEY, "upcoming"],
    queryFn: () => apiFetch<Appointment[]>("/api/appointments?view=upcoming"),
  });
}

/**
 * Fetch physician availability for a date.
 */
export function usePhysicianAvailability(physicianId: number | null, date: string) {
  return useQuery<AvailabilityResponse>({
    queryKey: [APPOINTMENTS_KEY, "availability", physicianId, date],
    queryFn: () =>
      apiFetch<AvailabilityResponse>(
        `/api/physicians/availability?physicianId=${physicianId}&date=${date}`
      ),
    enabled: !!physicianId && !!date,
  });
}

/**
 * Book a new appointment.
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      idPatient:       number;
      patientName:     string;
      idPhysician:     number;
      physicianName:   string;
      appointmentDate: string;
      timeSlot:        string;
      notes?:          string;
    }) => apiFetch<Appointment>("/api/appointments", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_KEY] });
    },
  });
}

/**
 * Cancel an appointment.
 */
export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/api/appointments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ action: "cancel" }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_KEY] });
    },
  });
}
