export type ConsumerIndexPhase = {
  label: string;
  range: string;
  textColorClass: string;
  mapColor: string;
  description: string;
};

export const consumerIndexPhases: ConsumerIndexPhase[] = [
  {
    label: "하강 국면 ▼",
    range: "0 ~ 94",
    textColorClass: "text-trend-down",
    mapColor: "#4D8DFF",
    description: "소비자들의 주택시장 기대가 평균보다 낮습니다.",
  },
  {
    label: "보합 국면 ―",
    range: "95 ~ 114",
    textColorClass: "text-trend-neutral",
    mapColor: "#F2C94C",
    description: "소비자들의 주택시장 기대가 평균 수준입니다.",
  },
  {
    label: "상승 국면 ▲",
    range: "115 ~ 200",
    textColorClass: "text-trend-up",
    mapColor: "#FF5555",
    description: "소비자들의 주택시장 기대가 평균 이상으로 높습니다.",
  },
];

export const getConsumerIndexPhase = (value: number) => {
  if (value <= 94) return consumerIndexPhases[0];
  if (value <= 114) return consumerIndexPhases[1];
  return consumerIndexPhases[2];
};
