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

export type HomeSubwayRankingMapItem = {
  name: string;
  value: number;
};

export type ConvenienceMapPin = {
  name: string;
  latitude: number;
  longitude: number;
};

export type SubwayLinePathPoint = {
  latitude: number;
  longitude: number;
};

export type SubwayLinePolyline = {
  lineName: string;
  color?: string;
  path: SubwayLinePathPoint[];
};

export type SubwayStationMarker = {
  stationName: string;
  lineName: string;
  sourceStationName?: string;
  sourceLineName?: string;
  latitude: number;
  longitude: number;
  color?: string;
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
  selectedSubwayIndexItem: SubwayIndexMapOverlayItem | null;
  safetyIndexItems: SafetyIndexMapOverlayItem[];
  selectedHomeRecommendationName: string | null;
  selectedHomeSubwayRanking: HomeSubwayRankingMapItem | null;
  selectedTransportNeighborhoodName: string | null;
  subwayLinePolylines: SubwayLinePolyline[];
  subwayStationMarkers: SubwayStationMarker[];
  selectedSubwayStationMarker: SubwayStationMarker | null;
  conveniencePins: ConvenienceMapPin[];
  convenienceMarkerType: ConvenienceMarkerType | null;
  setRentIndexItems: (items: RentIndexMapOverlayItem[]) => void;
  selectRentIndexItem: (item: RentIndexMapOverlayItem) => void;
  clearRentIndexItems: () => void;
  setConsumerIndexItem: (item: ConsumerIndexMapOverlayItem) => void;
  clearConsumerIndexItem: () => void;
  setSubwayIndexItems: (items: SubwayIndexMapOverlayItem[]) => void;
  selectSubwayIndexItem: (item: SubwayIndexMapOverlayItem) => void;
  clearSubwayIndexItems: () => void;
  setSafetyIndexItems: (items: SafetyIndexMapOverlayItem[]) => void;
  clearSafetyIndexItems: () => void;
  selectHomeRecommendation: (name: string) => void;
  clearSelectedHomeRecommendation: () => void;
  selectHomeSubwayRanking: (item: HomeSubwayRankingMapItem) => void;
  clearSelectedHomeSubwayRanking: () => void;
  selectTransportNeighborhood: (name: string) => void;
  clearSelectedTransportNeighborhood: () => void;
  setSubwayLinePolylines: (polylines: SubwayLinePolyline[]) => void;
  setSubwayStationMarkers: (markers: SubwayStationMarker[]) => void;
  selectSubwayStationMarker: (marker: SubwayStationMarker) => void;
  clearSubwayLinePolylines: () => void;
  clearSubwayStationMarkers: () => void;
  clearSelectedSubwayStationMarker: () => void;
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
  selectedSubwayIndexItem: null,
  safetyIndexItems: [],
  selectedHomeRecommendationName: null,
  selectedHomeSubwayRanking: null,
  selectedTransportNeighborhoodName: null,
  subwayLinePolylines: [],
  subwayStationMarkers: [],
  selectedSubwayStationMarker: null,
  conveniencePins: [],
  convenienceMarkerType: null,
  setRentIndexItems: (items) => set({ rentIndexItems: items }),
  selectRentIndexItem: (item) => set({ selectedRentIndexItem: item }),
  clearRentIndexItems: () =>
    set({ rentIndexItems: [], selectedRentIndexItem: null }),
  setConsumerIndexItem: (item) => set({ consumerIndexItem: item }),
  clearConsumerIndexItem: () => set({ consumerIndexItem: null }),
  setSubwayIndexItems: (items) =>
    set({ subwayIndexItems: items, selectedSubwayIndexItem: null }),
  selectSubwayIndexItem: (item) => set({ selectedSubwayIndexItem: item }),
  clearSubwayIndexItems: () =>
    set({ subwayIndexItems: [], selectedSubwayIndexItem: null }),
  setSafetyIndexItems: (items) => set({ safetyIndexItems: items }),
  clearSafetyIndexItems: () => set({ safetyIndexItems: [] }),
  selectHomeRecommendation: (name) =>
    set({
      selectedHomeRecommendationName: name,
      selectedHomeSubwayRanking: null,
      subwayLinePolylines: [],
      subwayStationMarkers: [],
      selectedSubwayStationMarker: null,
    }),
  clearSelectedHomeRecommendation: () =>
    set({ selectedHomeRecommendationName: null }),
  selectHomeSubwayRanking: (item) =>
    set({
      selectedHomeSubwayRanking: item,
      selectedHomeRecommendationName: null,
    }),
  clearSelectedHomeSubwayRanking: () =>
    set({
      selectedHomeSubwayRanking: null,
      subwayLinePolylines: [],
      subwayStationMarkers: [],
      selectedSubwayStationMarker: null,
    }),
  selectTransportNeighborhood: (name) =>
    set({ selectedTransportNeighborhoodName: name }),
  clearSelectedTransportNeighborhood: () =>
    set({ selectedTransportNeighborhoodName: null }),
  setSubwayLinePolylines: (polylines) =>
    set({ subwayLinePolylines: polylines }),
  setSubwayStationMarkers: (markers) => set({ subwayStationMarkers: markers }),
  selectSubwayStationMarker: (marker) =>
    set({ selectedSubwayStationMarker: marker }),
  clearSubwayLinePolylines: () => set({ subwayLinePolylines: [] }),
  clearSubwayStationMarkers: () =>
    set({ subwayStationMarkers: [], selectedSubwayStationMarker: null }),
  clearSelectedSubwayStationMarker: () =>
    set({ selectedSubwayStationMarker: null }),
  setConveniencePins: (pins, markerType) =>
    set({ conveniencePins: pins, convenienceMarkerType: markerType }),
  clearConveniencePins: () =>
    set({ conveniencePins: [], convenienceMarkerType: null }),
}));
