import { fetchDataFromApiGet } from "./api";
import { API_URL } from "./url";
import type { ResidenceReviewItem } from "@/types/home";

export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

export type Pageable = {
  pageNumber: number;
  pageSize: number;
};

export type PagedContent<T> = {
  content: T[];
  pageable?: Pageable;
  number?: number;
  size?: number;
  totalPages: number;
  totalElements: number;
};

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
  districtId: number;
  name: string;
  value: number;
};

type SubwayAccessibilityRankingsResponse = {
  success: boolean;
  code: string;
  message: string;
  data: SubwayAccessibilityRanking[];
};

export type DistrictSubwayStation = {
  stationName: string;
  lineName: string;
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

const collectSubwayLineNames = (value: unknown, lines: Set<string>) => {
  if (Array.isArray(value)) {
    value.forEach((item) => collectSubwayLineNames(item, lines));
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  Object.entries(value).forEach(([key, item]) => {
    const normalizedKey = key.toLowerCase();

    if (
      typeof item === "string" &&
      (normalizedKey === "line" || normalizedKey.includes("linename"))
    ) {
      lines.add(item);
      return;
    }

    if (
      Array.isArray(item) &&
      (normalizedKey.includes("line") || normalizedKey.includes("subway"))
    ) {
      item.forEach((line) => {
        if (typeof line === "string") {
          lines.add(line);
        } else {
          collectSubwayLineNames(line, lines);
        }
      });
      return;
    }

    collectSubwayLineNames(item, lines);
  });
};

const collectDistrictSubwayStations = (
  value: unknown,
  stations: DistrictSubwayStation[],
) => {
  if (Array.isArray(value)) {
    value.forEach((item) => collectDistrictSubwayStations(item, stations));
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  const record = value as Record<string, unknown>;
  const stationName =
    typeof record.stationName === "string" ? record.stationName : null;
  const lineName = typeof record.lineName === "string" ? record.lineName : null;
  const lineNames = [record.lineNames, record.lines, record.subwayLines]
    .filter(Array.isArray)
    .flat()
    .filter((item): item is string => typeof item === "string");

  if (stationName && lineName) {
    stations.push({ stationName, lineName });
  }

  if (stationName) {
    lineNames.forEach((stationLineName) => {
      stations.push({ stationName, lineName: stationLineName });
    });
  }

  Object.values(record).forEach((item) =>
    collectDistrictSubwayStations(item, stations),
  );
};

export const fetchDistrictSubwayDetail = async (districtId: number) => {
  const res = (await fetchDataFromApiGet({
    apiUrl: `${API_URL.SUBWAY_INDEX}/${districtId}`,
  })) as { data?: unknown };
  const lines = new Set<string>();
  const stations: DistrictSubwayStation[] = [];

  collectSubwayLineNames(res.data, lines);
  collectDistrictSubwayStations(res.data, stations);

  return {
    subwayLines: Array.from(lines),
    subwayStations: stations.filter(
      (station, index, items) =>
        items.findIndex(
          (item) =>
            item.stationName === station.stationName &&
            item.lineName === station.lineName,
        ) === index,
    ),
  };
};

export const fetchResidenceReview = async (): Promise<
  ApiResponse<PagedContent<ResidenceReviewItem>>
> => {
  const res = await fetchDataFromApiGet({
    apiUrl: API_URL.REVIEW,
  });

  return res;
};
