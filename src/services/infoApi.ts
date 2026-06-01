import { fetchDataFromApiGet } from "./api";
import { API_URL } from "./url";

export type HousingType = "APARTMENT" | "MULTI_FAMILY_HOUSE";
export type RentIndexChangePeriodType =
  | "ONE_YEAR"
  | "SIX_MONTH"
  | "ONE_MONTH";
export type RentIndexPeriodType = RentIndexChangePeriodType | "CURRENT";
export type ConsumerIndexPeriodType = RentIndexPeriodType;

export type RentIndexRankingItem = {
  rank: number;
  name: string;
  value: number;
};

export type ConvenienceRankingItem = {
  rank: number;
  id: number;
  name: string;
  count: number;
};

export type SubwayIndexDistrictItem = {
  id: number;
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

export type ConsumerIndexTrendItem = {
  yearMonth: string;
  value: number;
};

export type ConsumerIndexData = {
  trend: ConsumerIndexTrendItem[];
  year: string;
  month: string;
  value: number;
};

type ConsumerIndexResponse = {
  success: boolean;
  code: string;
  message: string;
  data: ConsumerIndexData;
};

export type SubwayIndexData = {
  high: RentIndexRankingItem[];
  changeRate: RentIndexRankingItem[];
  districtIndexes: SubwayIndexDistrictItem[];
};

type SubwayIndexResponse = {
  success: boolean;
  code: string;
  message: string;
  data: SubwayIndexData;
};

type ConvenienceInfoResponse = {
  success: boolean;
  code: string;
  message: string;
  data: {
    ranking: ConvenienceRankingItem[];
  };
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
  periodType: RentIndexChangePeriodType;
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

export const fetchConsumerIndex = async (
  periodType: ConsumerIndexPeriodType,
) => {
  const res = (await fetchDataFromApiGet({
    apiUrl: API_URL.CONSUMER_INDEX,
    params: { periodType },
  })) as ConsumerIndexResponse;

  return res.data;
};

export const fetchSubwayIndex = async () => {
  const res = (await fetchDataFromApiGet({
    apiUrl: API_URL.SUBWAY_INDEX,
  })) as SubwayIndexResponse;

  return {
    high: Array.isArray(res.data?.high) ? res.data.high : [],
    changeRate: Array.isArray(res.data?.changeRate)
      ? res.data.changeRate
      : [],
    districtIndexes: Array.isArray(res.data?.districtIndexes)
      ? res.data.districtIndexes
      : [],
  };
};

export const fetchConvenienceInfo = async () => {
  const res = (await fetchDataFromApiGet({
    apiUrl: API_URL.CONVENIENCE_INFO,
  })) as ConvenienceInfoResponse;

  return Array.isArray(res.data?.ranking) ? res.data.ranking : [];
};
