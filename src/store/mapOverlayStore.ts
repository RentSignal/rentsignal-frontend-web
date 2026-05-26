import { create } from "zustand";

export type RentIndexMapOverlayType = "CURRENT" | "RISE" | "FALL";

export type RentIndexMapOverlayItem = {
  rank: number;
  name: string;
  value: number;
  type: RentIndexMapOverlayType;
};

export type ConsumerIndexMapOverlayItem = {
  year: string;
  month: string;
  value: number;
};

type MapOverlayStore = {
  rentIndexItems: RentIndexMapOverlayItem[];
  selectedRentIndexItem: RentIndexMapOverlayItem | null;
  consumerIndexItem: ConsumerIndexMapOverlayItem | null;
  setRentIndexItems: (items: RentIndexMapOverlayItem[]) => void;
  selectRentIndexItem: (item: RentIndexMapOverlayItem) => void;
  clearRentIndexItems: () => void;
  setConsumerIndexItem: (item: ConsumerIndexMapOverlayItem) => void;
  clearConsumerIndexItem: () => void;
};

export const useMapOverlayStore = create<MapOverlayStore>((set) => ({
  rentIndexItems: [],
  selectedRentIndexItem: null,
  consumerIndexItem: null,
  setRentIndexItems: (items) => set({ rentIndexItems: items }),
  selectRentIndexItem: (item) => set({ selectedRentIndexItem: item }),
  clearRentIndexItems: () =>
    set({ rentIndexItems: [], selectedRentIndexItem: null }),
  setConsumerIndexItem: (item) => set({ consumerIndexItem: item }),
  clearConsumerIndexItem: () => set({ consumerIndexItem: null }),
}));
