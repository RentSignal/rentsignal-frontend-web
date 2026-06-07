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

export const fetchTodayRecommendations = async () => {
  const res = (await fetchDataFromApiGet({
    apiUrl: API_URL.TODAY_RECOMMENDATIONS,
  })) as TodayRecommendationsResponse;

  return Array.isArray(res.data) ? res.data : [];
};
