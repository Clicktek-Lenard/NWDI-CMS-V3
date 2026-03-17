"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

const SENDOUTS_KEY = "sendouts";

interface Sendout {
  id:            number;
  idQueue:       number;
  queueCode:     string;
  patientName:   string;
  idBUFrom:      string;
  idBUTo:        string;
  items:         string;
  notes:         string;
  status:        number;
  sentBy:        string;
  sentDate:      string;
  receivedBy:    string;
  dateReceived:  string | null;
  completedBy:   string;
  dateCompleted: string | null;
}

interface SendoutSummary {
  pending:   number;
  received:  number;
  completed: number;
}

/**
 * Fetch sendouts with optional filters.
 */
export function useSendouts(filters?: { status?: number; dateFrom?: string; dateTo?: string }) {
  const params = new URLSearchParams();
  if (filters?.status)   params.set("status", String(filters.status));
  if (filters?.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters?.dateTo)   params.set("dateTo", filters.dateTo);

  return useQuery<Sendout[]>({
    queryKey: [SENDOUTS_KEY, filters],
    queryFn: () => apiFetch<Sendout[]>(`/api/sendouts?${params}`),
  });
}

/**
 * Fetch sendout summary counts.
 */
export function useSendoutSummary() {
  return useQuery<SendoutSummary>({
    queryKey: [SENDOUTS_KEY, "summary"],
    queryFn: () => apiFetch<SendoutSummary>("/api/sendouts/summary"),
  });
}

/**
 * Create a new sendout.
 */
export function useCreateSendout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      idQueue:     number;
      queueCode?:  string;
      patientName?: string;
      idBUTo:      string;
      items?:      string;
      notes?:      string;
    }) => apiFetch<Sendout>("/api/sendouts", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SENDOUTS_KEY] });
    },
  });
}

/**
 * Mark sendout as received.
 */
export function useReceiveSendout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/api/sendouts/${id}/receive`, { method: "POST", body: JSON.stringify({}) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SENDOUTS_KEY] });
    },
  });
}

/**
 * Mark sendout as completed.
 */
export function useCompleteSendout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/api/sendouts/${id}/complete`, { method: "POST", body: JSON.stringify({}) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SENDOUTS_KEY] });
    },
  });
}
