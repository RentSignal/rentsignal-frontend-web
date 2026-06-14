const DEFAULT_SUBWAY_LINE_COLOR = "#3385FF";

export const subwayLineColorMap: Record<string, string> = {
  "1": "#2955A4",
  "2": "#00BA00",
  "3": "#D2683D",
  "4": "#3B66B6",
  "5": "#794B97",
  "6": "#96572A",
  "7": "#555D10",
  "8": "#B43667",
  "9": "#C6AF5B",
  신림선: "#5E7DBB",
  신분당선: "#B81B30",
  경부선: "#2955A4",
  경의중앙선: "#6AC2B3",
  공항철도: "#0079AC",
  수인분당선: "#ECA300",
  우이신설선: "#BACC50",
  김포골드라인: "#957326",
};

export const getSubwayLineLabel = (lineName: string) => {
  const match = lineName.match(/\d+/);

  return match?.[0] ?? lineName;
};

export const isNumberSubwayLine = (lineName: string) =>
  /^\d+$/.test(getSubwayLineLabel(lineName));

export const getSubwayLineColor = (lineName: string) =>
  subwayLineColorMap[getSubwayLineLabel(lineName)] ??
  DEFAULT_SUBWAY_LINE_COLOR;
