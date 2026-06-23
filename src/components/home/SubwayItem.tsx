import { useState } from "react";
import SubwayLineBadge from "@/components/home/SubwayLineBadge";
import type { SubwayItemProps } from "@/types/home";
import { getSubwayLineLabel } from "@/utils/subwayLineStyle";

const MAX_VISIBLE_SUBWAY_LINES = 3;

const SubwayItem = ({
  rank,
  name,
  value,
  subwayLines,
  onClick,
}: SubwayItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleSubwayLines = subwayLines.slice(0, MAX_VISIBLE_SUBWAY_LINES);
  const hiddenSubwayLines = subwayLines.slice(MAX_VISIBLE_SUBWAY_LINES);
  const hiddenSubwayLineCount = Math.max(
    subwayLines.length - MAX_VISIBLE_SUBWAY_LINES,
    0,
  );

  return (
    <div className="mb-[6px]">
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick();
          }
        }}
        className="grid min-h-[40px] w-full cursor-pointer grid-cols-[24px_64px_minmax(0,1fr)_auto] items-center gap-2 px-[28px] py-2 text-left transition-colors hover:bg-coolNeutral-99"
      >
        <h4 className="text-base font-medium text-coolNeutral-50">{rank}</h4>
        <h4 className="text-sm font-medium truncate text-coolNeutral-50">
          {name}
        </h4>
        <div
          className="flex items-center min-w-0 gap-1 overflow-hidden"
          aria-label={
            subwayLines.length > 0
              ? `운행 노선: ${subwayLines.map(getSubwayLineLabel).join(", ")}`
              : "운행 노선 정보 없음"
          }
        >
          {visibleSubwayLines.map((lineName) => (
            <SubwayLineBadge key={lineName} lineName={lineName} />
          ))}
          {hiddenSubwayLineCount > 0 && (
            <button
              type="button"
              aria-expanded={isExpanded}
              aria-label={`숨겨진 노선 ${hiddenSubwayLineCount}개 ${
                isExpanded ? "접기" : "펼치기"
              }`}
              onClick={(event) => {
                event.stopPropagation();
                setIsExpanded((previous) => !previous);
              }}
              onKeyDown={(event) => event.stopPropagation()}
              className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-coolNeutral-95 px-1 text-[9px] text-coolNeutral-25 font-bold text-coolNeutral-40"
            >
              {isExpanded ? "접기" : `+${hiddenSubwayLineCount}`}
            </button>
          )}
        </div>
        <h4 className="text-sm font-semibold whitespace-nowrap text-blue-50">
          {value}점
        </h4>
      </div>
      {isExpanded && hiddenSubwayLines.length > 0 && (
        <div className="flex flex-wrap gap-1 rounded-b-lg bg-blue-99 py-2 pl-[132px] pr-2">
          {hiddenSubwayLines.map((lineName) => (
            <SubwayLineBadge key={lineName} lineName={lineName} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubwayItem;
