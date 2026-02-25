import { create } from "zustand";
import type { QueueStatus } from "@/types";

interface QueueStore {
  selectedStatus: QueueStatus | null;
  searchQuery: string;
  setSelectedStatus: (status: QueueStatus | null) => void;
  setSearchQuery: (query: string) => void;
  reset: () => void;
}

export const useQueueStore = create<QueueStore>((set) => ({
  selectedStatus: null,
  searchQuery: "",
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  reset: () => set({ selectedStatus: null, searchQuery: "" }),
}));
