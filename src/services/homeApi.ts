import { fetchDataFromApiGet } from "./api";
import { API_URL } from "./url";

export type FacilityCountItem = {
  count: number;
  normalized: number;
};

export type TodayRecommendation = {
  dongName: string;
  rank: number;
  score: number;
  distance: number | null;
  facilityCount: {
    restaurant: FacilityCountItem;
    hospital: FacilityCountItem;
    cafe: FacilityCountItem;
    pharmacy: FacilityCountItem;
    mart: FacilityCountItem;
  };
  avgDeposit: number | null;
  avgMonthly: number | null;
  transport: number;
  safety: number;
};

type TodayRecommendationsResponse = {
  success: boolean;
  code: string;
  message: string;
  data: TodayRecommendation[];
};

export type SubwayAccessibilityRanking = {
  rank: number;
  name: string;
  value: number;
};

type SubwayAccessibilityRankingsResponse = {
  success: boolean;
  code: string;
  message: string;
  data: SubwayAccessibilityRanking[];
};

export const fetchTodayRecommendations = async () => {
  const res = (await fetchDataFromApiGet({
    apiUrl: API_URL.TODAY_RECOMMENDATIONS,
  })) as TodayRecommendationsResponse;

  return Array.isArray(res.data) ? res.data : [];
};

export const fetchSubwayAccessibilityRankings = async () => {
  const res = (await fetchDataFromApiGet({
    apiUrl: API_URL.SUBWAY_RANKING,
  })) as SubwayAccessibilityRankingsResponse;

  return Array.isArray(res.data) ? res.data : [];
};
