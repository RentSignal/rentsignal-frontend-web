import StationIndexBar from "@/assets/icons/station_phrase.svg?react";
import {
  getSubwayLineColor,
  getSubwayLineLabel,
  isNumberSubwayLine,
} from "@/utils/subwayLineStyle";

export type StationIndexStationGroup = {
  lineName: string;
  stationNames: string[];
};

export type StationIndexDetail = {
  districtName: string;
  score: number;
  stationGroups: StationIndexStationGroup[];
};

type StationIndexSectionProps = {
  title: string;
  detail?: StationIndexDetail | null;
  isDetailLoading?: boolean;
  detailErrorMessage?: string;
};

const formatScore = (score: number) => {
  const fixedScore = score.toFixed(2);

  return fixedScore.endsWith("0") ? score.toFixed(1) : fixedScore;
};

const SubwayLineCircle = ({
  lineName,
  size = "large",
}: {
  lineName: string;
  size?: "large" | "small";
}) => {
  const lineLabel = getSubwayLineLabel(lineName);
  const isNumberLine = isNumberSubwayLine(lineName);
  const circleSize =
    size === "large"
      ? isNumberLine
        ? "h-[34px] w-[34px]"
        : "h-[34px] min-w-[56px] px-3"
      : isNumberLine
        ? "h-[24px] w-[24px]"
        : "h-[24px] w-[24px] px-2";
  const textSize =
    size === "large"
      ? isNumberLine
        ? "text-[14px]"
        : "text-xs"
      : isNumberLine
        ? "text-[14px]"
        : "text-[10px]";

  return (
    <div
      className={`${circleSize} flex shrink-0 items-center justify-center rounded-full font-bold text-white ${textSize}`}
      style={{ backgroundColor: getSubwayLineColor(lineName) }}
    >
      <span className="whitespace-nowrap">{lineLabel}</span>
    </div>
  );
};

const StationIndexDetailView = ({
  detail,
  isLoading,
  errorMessage,
}: {
  detail: StationIndexDetail;
  isLoading?: boolean;
  errorMessage?: string;
}) => {
  const visibleGroups = detail.stationGroups.slice(0, 3);

  return (
    <div className="flex flex-col px-5 pt-[26px] pb-[52px]">
      <h2 className="text-base font-bold leading-[1.25] text-coolNeutral-10">
        {detail.districtName} 지하철 역세권 지수
      </h2>
      <div className="pt-[5px] text-base font-semibold leading-none text-danger">
        {formatScore(detail.score)}점
      </div>

      {isLoading && (
        <div className="flex h-[300px] items-center justify-center">
          <div className="h-8 w-8 rounded-full border-[4px] border-coolNeutral-95 border-t-blue-60 animate-spin" />
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="pt-[56px] text-sm font-medium text-coolNeutral-50">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && visibleGroups.length === 0 && (
        <div className="pt-[56px] text-sm font-medium text-coolNeutral-50">
          표시할 지하철역 데이터가 없습니다.
        </div>
      )}

      {!isLoading && !errorMessage && visibleGroups.length > 0 && (
        <>
          <div className="flex items-center gap-[16px] pt-[20px]">
            {visibleGroups.map((group) => (
              <SubwayLineCircle
                key={group.lineName}
                lineName={group.lineName}
              />
            ))}
          </div>

          <div className="flex flex-col gap-[28px] pt-[22px]">
            {visibleGroups.map((group) => (
              <div
                key={group.lineName}
                className="flex items-center gap-[14px]"
              >
                <SubwayLineCircle lineName={group.lineName} size="small" />
                <div className="grid min-w-0 flex-1 grid-cols-3 gap-x-[14px] gap-y-2">
                  {group.stationNames.slice(0, 3).map((stationName) => (
                    <div
                      key={`${group.lineName}-${stationName}`}
                      className="truncate text-[14px] font-medium leading-[1.25] text-coolNeutral-10"
                    >
                      {stationName}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const StationIndexSection = ({
  title,
  detail,
  isDetailLoading = false,
  detailErrorMessage,
}: StationIndexSectionProps) => {
  if (detail) {
    return (
      <StationIndexDetailView
        detail={detail}
        isLoading={isDetailLoading}
        errorMessage={detailErrorMessage}
      />
    );
  }

  return (
    <div className="flex flex-col pt-[15px] pl-5">
      <div className="text-base font-semibold text-coolNeutral-10">{title}</div>
      <div className="pt-[55px] pb-[83px]">
        <StationIndexBar />
      </div>
    </div>
  );
};

export default StationIndexSection;
