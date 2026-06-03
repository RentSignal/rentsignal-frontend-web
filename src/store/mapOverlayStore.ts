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

export type SubwayIndexMapOverlayItem = {
  id: number;
  name: string;
  value: number;
};

export type ConvenienceMapPin = {
  name: string;
  latitude: number;
  longitude: number;
};

type MapOverlayStore = {
  rentIndexItems: RentIndexMapOverlayItem[];
  selectedRentIndexItem: RentIndexMapOverlayItem | null;
  consumerIndexItem: ConsumerIndexMapOverlayItem | null;
  subwayIndexItems: SubwayIndexMapOverlayItem[];
  conveniencePins: ConvenienceMapPin[];
  setRentIndexItems: (items: RentIndexMapOverlayItem[]) => void;
  selectRentIndexItem: (item: RentIndexMapOverlayItem) => void;
  clearRentIndexItems: () => void;
  setConsumerIndexItem: (item: ConsumerIndexMapOverlayItem) => void;
  clearConsumerIndexItem: () => void;
  setSubwayIndexItems: (items: SubwayIndexMapOverlayItem[]) => void;
  clearSubwayIndexItems: () => void;
  setConveniencePins: (pins: ConvenienceMapPin[]) => void;
  clearConveniencePins: () => void;
};

export const useMapOverlayStore = create<MapOverlayStore>((set) => ({
  rentIndexItems: [],
  selectedRentIndexItem: null,
  consumerIndexItem: null,
  subwayIndexItems: [],
  conveniencePins: [],
  setRentIndexItems: (items) => set({ rentIndexItems: items }),
  selectRentIndexItem: (item) => set({ selectedRentIndexItem: item }),
  clearRentIndexItems: () =>
    set({ rentIndexItems: [], selectedRentIndexItem: null }),
  setConsumerIndexItem: (item) => set({ consumerIndexItem: item }),
  clearConsumerIndexItem: () => set({ consumerIndexItem: null }),
  setSubwayIndexItems: (items) => set({ subwayIndexItems: items }),
  clearSubwayIndexItems: () => set({ subwayIndexItems: [] }),
  setConveniencePins: (pins) => set({ conveniencePins: pins }),
  clearConveniencePins: () => set({ conveniencePins: [] }),
}));
