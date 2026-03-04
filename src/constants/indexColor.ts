export type Index = "rise" | "neutral" | "fall";

export const TREND_COLOR: Record<
  Index,
  {
    fillColor: string;
    strokeColor: string;
    fillOpacity?: number;
  }
> = {
  // 상승 국면
  rise: {
    fillColor: "#F97316",
    strokeColor: "#EA580C",
    fillOpacity: 0.22,
  },
  // 보합 국면
  neutral: {
    fillColor: "#FACC15",
    strokeColor: "#CA8A04",
    fillOpacity: 0.18,
  },
  // 하락 국면
  fall: {
    fillColor: "#2563EB",
    strokeColor: "#1D4ED8",
    fillOpacity: 0.22,
  },
};
