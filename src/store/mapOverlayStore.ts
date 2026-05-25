import { create } from "zustand";

export type RentIndexMapOverlayType = "CURRENT" | "RISE" | "FALL";

export type RentIndexMapOverlayItem = {
  rank: number;
  name: string;
  value: number;
  type: RentIndexMapOverlayType;
};

type MapOverlayStore = {
  rentIndexItems: RentIndexMapOverlayItem[];
  selectedRentIndexItem: RentIndexMapOverlayItem | null;
  setRentIndexItems: (items: RentIndexMapOverlayItem[]) => void;
  selectRentIndexItem: (item: RentIndexMapOverlayItem) => void;
  clearRentIndexItems: () => void;
};

export const useMapOverlayStore = create<MapOverlayStore>((set) => ({
  rentIndexItems: [],
  selectedRentIndexItem: null,
  setRentIndexItems: (items) => set({ rentIndexItems: items }),
  selectRentIndexItem: (item) => set({ selectedRentIndexItem: item }),
  clearRentIndexItems: () =>
    set({ rentIndexItems: [], selectedRentIndexItem: null }),
}));
