import { fetchDataFromApiGet, fetchDataFromApiPost } from "./api";
import { API_URL } from "./url";
import type { RecommendFormData } from "@/types/recommend";

export const fetchHousingRecommendations = async (
  payload: RecommendFormData,
) => {
  const res = await fetchDataFromApiPost({
    apiUrl: API_URL.RECOMMEND,
    body: payload,
  });

  return res;
};
