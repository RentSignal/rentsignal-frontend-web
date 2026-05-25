import { fetchDataFromApiGet } from "./api";
import { API_URL } from "./url";

export type HousingType = "APARTMENT" | "MULTI_FAMILY_HOUSE";
export type RentIndexPeriodType = "ONE_YEAR" | "SIX_MONTH" | "ONE_MONTH";

export type RentIndexRankingItem = {
  rank: number;
  name: string;
  value: number;
};

type RentIndexCurrentResponse = {
  success: boolean;
  code: string;
  message: string;
  data: {
    indexes: RentIndexRankingItem[];
  };
};

type RentIndexChangeResponse = {
  success: boolean;
  code: string;
  message: string;
  data: {
    rise: RentIndexRankingItem[];
    fall: RentIndexRankingItem[];
  };
};

export type RentIndexChangeRankings = {
  rise: RentIndexRankingItem[];
  fall: RentIndexRankingItem[];
};

const getCurrentRentIndexItems = (res: RentIndexCurrentResponse) => {
  return Array.isArray(res.data?.indexes) ? res.data.indexes : [];
};

export const fetchRentIndexRankings = async (housingType: HousingType) => {
  const res = (await fetchDataFromApiGet({
    apiUrl: API_URL.RENT_INDEX_RANKINGS,
    params: { housingType },
  })) as RentIndexCurrentResponse;

  return getCurrentRentIndexItems(res);
};

export const fetchRentIndexChangeRankings = async ({
  housingType,
  periodType,
}: {
  housingType: HousingType;
  periodType: RentIndexPeriodType;
}) => {
  const res = (await fetchDataFromApiGet({
    apiUrl: API_URL.RENT_INDEX_CHANGE,
    params: { housingType, periodType },
  })) as RentIndexChangeResponse;

  const rankings = {
    rise: Array.isArray(res.data?.rise) ? res.data.rise : [],
    fall: Array.isArray(res.data?.fall) ? res.data.fall : [],
  };

  return rankings;
};
