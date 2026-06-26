import type { SubwayLineBadgeProps } from "@/types/home";
import {
  getSubwayLineColor,
  getSubwayLineLabel,
  isNumberSubwayLine,
} from "@/utils/subwayLineStyle";

const SubwayLineBadge = ({ lineName }: SubwayLineBadgeProps) => {
  const lineLabel = getSubwayLineLabel(lineName);
  const isNumberLine = isNumberSubwayLine(lineName);

  return (
    <span
      className={`flex h-5 shrink-0 items-center justify-center whitespace-nowrap rounded-full text-[9px] font-bold text-white ${
        isNumberLine ? "w-5" : "max-w-[46px] px-1.5"
      }`}
      style={{ backgroundColor: getSubwayLineColor(lineName) }}
    >
      <span className="truncate">{lineLabel}</span>
    </span>
  );
};

export default SubwayLineBadge;
