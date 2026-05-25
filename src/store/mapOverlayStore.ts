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
  setRentIndexItems: (items: RentIndexMapOverlayItem[]) => void;
  clearRentIndexItems: () => void;
};

export const useMapOverlayStore = create<MapOverlayStore>((set) => ({
  rentIndexItems: [],
  setRentIndexItems: (items) => set({ rentIndexItems: items }),
  clearRentIndexItems: () => set({ rentIndexItems: [] }),
}));
