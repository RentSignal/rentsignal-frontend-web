import { fetchDataFromApiGet } from "./api";
import { API_URL } from "./url";

export type HousingType = "APARTMENT" | "MULTI_FAMILY_HOUSE";
export type RentIndexChangePeriodType = "ONE_YEAR" | "SIX_MONTH" | "ONE_MONTH";
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

export type ConvenienceCategoryKey =
  | "mart"
  | "convenienceStore"
  | "hospital"
  | "cafe";

export type ConveniencePlace = {
  name: string;
  latitude: number;
  longitude: number;
};

export type ConvenienceCategory = {
  count: number;
  conveniences: ConveniencePlace[];
};

export type ConvenienceDetail = {
  name: string;
  mart: ConvenienceCategory;
  convenienceStore: ConvenienceCategory;
  hospital: ConvenienceCategory;
  cafe: ConvenienceCategory;
};

export type SubwayIndexDistrictItem = {
  id: number;
  name: string;
  value: number;
};

export type SafetyRankingItem = {
  rank: number;
  name: string;
  value: number;
};

export type SafetyDistrictScoreItem = {
  name: string;
  value: number;
};

export type SafetyInfoData = {
  ranking: SafetyRankingItem[];
  districtSafetyScores: SafetyDistrictScoreItem[];
};

export type BusinessDistrictType =
  | "GBD_GANGNAM"
  | "GBD_YEOKSAM"
  | "GBD_SAMSEONG"
  | "GBD_JAMSIL"
  | "YBD_YEOUIDO"
  | "YBD_YEOUINARU"
  | "YBD_DANGSAN"
  | "CBD_GWANGHWAMUN"
  | "CBD_CITYHALL"
  | "CBD_JONGGAK";

export type TransportStationItem = {
  lineName: string;
  stationName: string;
  travelTimeMinutes: number;
  travelTimeSeconds: number;
};

export type TransportRecommendedNeighborhood = {
  id: number;
  name: string;
  stations: TransportStationItem[];
};

export type TransportType = "BUS_STOP" | "SUBWAY_STATION";

export type TransportNearbySubwayStation = {
  lineName: string;
  stationName: string;
};

export type TransportCountItem = {
  transportType: TransportType;
  count: number;
  ratioToAverage: number;
};

export type TransportDetail = {
  name: string;
  subwayStations: TransportNearbySubwayStation[];
  counts: TransportCountItem[];
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

type SafetyInfoResponse = {
  success: boolean;
  code: string;
  message: string;
  data: SafetyInfoData;
};

type ConvenienceInfoResponse = {
  success: boolean;
  code: string;
  message: string;
  data: {
    ranking: ConvenienceRankingItem[];
  };
};

type ConvenienceDetailResponse = {
  success: boolean;
  code: string;
  message: string;
  data: ConvenienceDetail;
};

type TransportListResponse = {
  success: boolean;
  code: string;
  message: string;
  data: TransportRecommendedNeighborhood[];
};

type TransportDetailResponse = {
  success: boolean;
  code: string;
  message: string;
  data: TransportDetail;
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
    changeRate: Array.isArray(res.data?.changeRate) ? res.data.changeRate : [],
    districtIndexes: Array.isArray(res.data?.districtIndexes)
      ? res.data.districtIndexes
      : [],
  };
};

export const fetchSafetyInfo = async () => {
  const res = (await fetchDataFromApiGet({
    apiUrl: API_URL.SAFETY_INFO,
  })) as SafetyInfoResponse;

  return {
    ranking: Array.isArray(res.data?.ranking) ? res.data.ranking : [],
    districtSafetyScores: Array.isArray(res.data?.districtSafetyScores)
      ? res.data.districtSafetyScores
      : [],
  };
};

export const fetchConvenienceInfo = async () => {
  const res = (await fetchDataFromApiGet({
    apiUrl: API_URL.CONVENIENCE_INFO,
  })) as ConvenienceInfoResponse;

  return Array.isArray(res.data?.ranking) ? res.data.ranking : [];
};

export const fetchConvenienceDetail = async (neighborhoodId: number) => {
  const res = (await fetchDataFromApiGet({
    apiUrl: `${API_URL.CONVENIENCE_INFO}/${neighborhoodId}`,
  })) as ConvenienceDetailResponse;

  return res.data;
};

export const fetchTransportInfo = async (type: BusinessDistrictType) => {
  const res = (await fetchDataFromApiGet({
    apiUrl: API_URL.TRANSPORT_INFO,
    params: { type },
  })) as TransportListResponse;

  return Array.isArray(res.data) ? res.data : [];
};

export const fetchTransportDetail = async (neighborhoodId: number) => {
  const res = (await fetchDataFromApiGet({
    apiUrl: `${API_URL.TRANSPORT_INFO}/${neighborhoodId}`,
  })) as TransportDetailResponse;

  return res.data;
};
