import type {
  RentIndexChangePeriodType,
  RentIndexPeriodType,
} from "@/services/infoApi";

export type InfoSectionToggleType = "INFO" | "LIFESTYLE";
export type InfoIndexId = "rent-index" | "consumer-index" | "station-index";
export type InfoFacilityId = "facility" | "transport" | "safety";

export const indexItemsBase = [
  {
    id: "rent-index",
    label: "전월세 통합지수",
    title: "전월세 통합지수란?",
    description:
      "특정 지역의 전세와 월세 가격 흐름을 하나로 묶어, 지금 그 지역의 임대 시장이 어느 정도 수준인지를 한눈에 보여주는 지표입니다.",
  },
  {
    id: "consumer-index",
    label: "소비자 심리지수",
    title: "소비자 심리지수(Consumer Sentiment Index, CSI)란?",
    description:
      "소비자 심리지수는 소비자들이 현재와 미래의 경제 상황을 어떻게 인식하고 있는지를 수치로 나타낸 경기 체감 지표입니다. 소비·투자·주택·고용 등 경제 전반에 대한 심리 상태를 요약합니다.",
  },
  {
    id: "station-index",
    label: "지하철 역세권 지수",
    title: "지하철 역세권 지수란?",
    description: "주요 지하철역과의 접근성 및 가치를 지수로 표현한 것입니다.",
  },
] as const;

export const facilitiesItems = [
  { id: "facility", label: "편의시설" },
  { id: "transport", label: "교통" },
  { id: "safety", label: "치안" },
] as const;

const periodTypeMonthOffset: Record<RentIndexChangePeriodType, number> = {
  ONE_YEAR: 12,
  SIX_MONTH: 6,
  ONE_MONTH: 1,
};

export const getIndexDateLabel = (periodType: RentIndexPeriodType) => {
  const monthOffset =
    periodType === "CURRENT" ? 0 : periodTypeMonthOffset[periodType];
  const date = new Date();
  date.setMonth(date.getMonth() - 1 - monthOffset);

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
};
