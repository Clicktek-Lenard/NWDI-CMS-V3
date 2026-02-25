"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { QueueEntry, QueueStatus, PaginatedResponse } from "@/types";

const QUEUE_KEY = "queue";

/**
 * Fetch today's queue with auto-refresh.
 */
export function useQueue(status?: QueueStatus, page = 1) {
  return useQuery<PaginatedResponse<QueueEntry>>({
    queryKey: [QUEUE_KEY, status, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page) });
      if (status) params.set("status", status);
      const { data } = await axios.get(`/api/queue?${params}`);
      return data;
    },
    refetchInterval: 15_000, // Refresh every 15 seconds for live queue
  });
}

/**
 * Fetch queue stats.
 */
export function useQueueStats() {
  return useQuery({
    queryKey: [QUEUE_KEY, "stats"],
    queryFn: async () => {
      const { data } = await axios.get("/api/queue/stats");
      return data as {
        waiting: number;
        inProgress: number;
        completed: number;
        total: number;
      };
    },
    refetchInterval: 10_000,
  });
}

/**
 * Add patient to queue.
 */
export function useAddToQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      patientId: string;
      patientName: string;
      companyCode?: string;
      companyName?: string;
    }) => {
      const { data } = await axios.post("/api/queue", input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUEUE_KEY] });
    },
  });
}

/**
 * Update queue status.
 */
export function useUpdateQueueStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: QueueStatus;
    }) => {
      const { data } = await axios.patch(`/api/queue/${id}`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUEUE_KEY] });
    },
  });
}
