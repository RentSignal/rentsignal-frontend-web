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

export type SafetyIndexMapOverlayItem = {
  name: string;
  value: number;
};

export type ConvenienceMapPin = {
  name: string;
  latitude: number;
  longitude: number;
};

export type ConvenienceMarkerType =
  | "mart"
  | "convenienceStore"
  | "hospital"
  | "cafe";

type MapOverlayStore = {
  rentIndexItems: RentIndexMapOverlayItem[];
  selectedRentIndexItem: RentIndexMapOverlayItem | null;
  consumerIndexItem: ConsumerIndexMapOverlayItem | null;
  subwayIndexItems: SubwayIndexMapOverlayItem[];
  safetyIndexItems: SafetyIndexMapOverlayItem[];
  conveniencePins: ConvenienceMapPin[];
  convenienceMarkerType: ConvenienceMarkerType | null;
  setRentIndexItems: (items: RentIndexMapOverlayItem[]) => void;
  selectRentIndexItem: (item: RentIndexMapOverlayItem) => void;
  clearRentIndexItems: () => void;
  setConsumerIndexItem: (item: ConsumerIndexMapOverlayItem) => void;
  clearConsumerIndexItem: () => void;
  setSubwayIndexItems: (items: SubwayIndexMapOverlayItem[]) => void;
  clearSubwayIndexItems: () => void;
  setSafetyIndexItems: (items: SafetyIndexMapOverlayItem[]) => void;
  clearSafetyIndexItems: () => void;
  setConveniencePins: (
    pins: ConvenienceMapPin[],
    markerType: ConvenienceMarkerType,
  ) => void;
  clearConveniencePins: () => void;
};

export const useMapOverlayStore = create<MapOverlayStore>((set) => ({
  rentIndexItems: [],
  selectedRentIndexItem: null,
  consumerIndexItem: null,
  subwayIndexItems: [],
  safetyIndexItems: [],
  conveniencePins: [],
  convenienceMarkerType: null,
  setRentIndexItems: (items) => set({ rentIndexItems: items }),
  selectRentIndexItem: (item) => set({ selectedRentIndexItem: item }),
  clearRentIndexItems: () =>
    set({ rentIndexItems: [], selectedRentIndexItem: null }),
  setConsumerIndexItem: (item) => set({ consumerIndexItem: item }),
  clearConsumerIndexItem: () => set({ consumerIndexItem: null }),
  setSubwayIndexItems: (items) => set({ subwayIndexItems: items }),
  clearSubwayIndexItems: () => set({ subwayIndexItems: [] }),
  setSafetyIndexItems: (items) => set({ safetyIndexItems: items }),
  clearSafetyIndexItems: () => set({ safetyIndexItems: [] }),
  setConveniencePins: (pins, markerType) =>
    set({ conveniencePins: pins, convenienceMarkerType: markerType }),
  clearConveniencePins: () =>
    set({ conveniencePins: [], convenienceMarkerType: null }),
}));
