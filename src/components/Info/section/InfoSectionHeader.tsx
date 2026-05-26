import { useState } from "react";
import TimeIndicator from "@/components/TimeIndicator";
import type { TimeIndicatorValue } from "@/components/TimeIndicator";
import PopOverIcon from "@/assets/icons/grey_popover_icon.svg?react";
import PopOverBlue from "@/assets/icons/blue_60_popover_icon.svg?react";
import PopOverClose from "@/assets/icons/popover_close.svg?react";
import CircularProgress from "../CircularProgress";
import BasicLineChart from "../BasicLineChart";
import StationIndexBar from "@/assets/icons/station_index_tip.svg?react";
import type {
  ConsumerIndexData,
  ConsumerIndexPeriodType,
} from "@/services/infoApi";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const IndexState = {
  rentIndex: 0,
  consumerIndex: 1,
  stationIndex: 2,
} as const;

type IndexState = (typeof IndexState)[keyof typeof IndexState];

type Props = {
  title: string;
  date?: string;
  selectedIndex?: IndexState;
  description?: string;
  periodType?: TimeIndicatorValue;
  onPeriodTypeChange?: (value: TimeIndicatorValue) => void;
  consumerIndexData?: ConsumerIndexData | null;
  isLoading?: boolean;
  errorMessage?: string;
};

const periodTypeLabels: Record<ConsumerIndexPeriodType, string> = {
  ONE_YEAR: "1년전 대비",
  SIX_MONTH: "6개월전 대비",
  ONE_MONTH: "1개월전 대비",
  CURRENT: "현재 지수",
};

const phases = [
  {
    label: "상승 국면 ▲",
    range: "0 ~ 94",
    color: "text-trend-up",
    desc: "소비자들의 주택시장 기대가 평균 이상으로 높습니다.",
  },
  {
    label: "보합 국면 ―",
    range: "95 ~ 114",
    color: "text-trend-neutral",
    desc: "소비자들의 주택시장 기대가 평균 수준입니다.",
  },
  {
    label: "하락 국면 ▼",
    range: "115 ~ 200",
    color: "text-trend-down",
    desc: "소비자들의 주택시장 기대가 평균보다 낮습니다.",
  },
];

const RentIndexSection = ({
  title,
  date,
  periodType = "ONE_YEAR",
  onPeriodTypeChange,
}: Props) => {
  return (
    <>
      {/* 제목 */}
      <div className="text-base font-semibold text-coolNeutral-10">{title}</div>

      {/* sub 영역 */}
      <div>
        <div className="flex items-center justify-end pr-5">
          <div className="font-medium text-[14px] text-coolNeutral-30">
            {date}
          </div>
        </div>
        <div className="pt-[40px]">
          <TimeIndicator value={periodType} onChange={onPeriodTypeChange} />
        </div>
      </div>
    </>
  );
};

const ConsumerIndexSection = ({
  title,
  periodType = "ONE_YEAR",
  onPeriodTypeChange,
  consumerIndexData,
  isLoading = false,
  errorMessage,
}: Props) => {
  const [open, setOpen] = useState(false);
  const consumerPeriodType = periodType as ConsumerIndexPeriodType;
  const value = consumerIndexData?.value ?? 0;
  const isCurrent = consumerPeriodType === "CURRENT";
  const isPositive = value > 0;
  const isNegative = value < 0;
  const trendText = isCurrent
    ? `${value.toFixed(1)}점`
    : `${isPositive ? "▲" : isNegative ? "▼" : ""}${Math.abs(value).toFixed(
        2,
      )}% ${isPositive ? "증가" : isNegative ? "감소" : "변동 없음"}`;
  const trendColor = isPositive
    ? "text-trend-up"
    : isNegative
      ? "text-trend-down"
      : "text-trend-neutral";
  const date = consumerIndexData
    ? `${consumerIndexData.year}년 ${consumerIndexData.month}월`
    : "";
  const chartData =
    consumerIndexData?.trend.map((item) => ({
      date: item.yearMonth.replace(/\s/g, ""),
      value: item.value,
    })) ?? [];

  return (
    <>
      <div className="flex flex-col pt-[15px] pl-5 gap-[7px]">
        {/* 제목 */}
        <div className="text-base font-semibold text-coolNeutral-10">
          {title}
        </div>

        {/* sub + popover */}
        <div>
          <div className="flex items-center justify-between pr-5">
            <p className="font-semibold text-coolNeutral-30 text-[15px]">
              {periodTypeLabels[consumerPeriodType]}
            </p>

            <div className="font-medium text-[14px] text-coolNeutral-30">
              {date}
            </div>
          </div>

          <div className="relative flex items-center gap-2">
            <p className={`text-sm font-medium ${trendColor}`}>
              {isLoading ? "불러오는 중" : trendText}
            </p>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button className="bg-white rounded-full shadow-sm">
                  {open ? (
                    <PopOverBlue className="w-[13px] h-[13px]" />
                  ) : (
                    <PopOverIcon className="w-[13px] h-[13px]" />
                  )}
                </button>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                sideOffset={10}
                alignOffset={-80}
                className="px-[24px] pt-[30px] pb-[30px] bg-white 
              shadow-[0_2px_8px_rgba(0,0,0,0.12)] 
              w-[346px] rounded-[21px] ring-0"
              >
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-5 right-4"
                >
                  <PopOverClose className="w-3 h-3 text-coolNeutral-50" />
                </button>

                <div className="flex flex-col gap-8">
                  {phases.map((item) => (
                    <div key={item.label} className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <p className="font-semibold">
                          <span>[</span>
                          <span className={item.color}>{item.label}</span>
                          <span>]</span>
                        </p>

                        <p className="text-sm font-semibold">{item.range}</p>
                      </div>

                      <p className="text-sm font-semibold leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {errorMessage && (
          <p className="pr-5 text-sm text-coolNeutral-50">{errorMessage}</p>
        )}
        <div className="flex justify-center py-[50px]">
          {isLoading ? (
            <div className="w-8 h-8 border-[3px] border-coolNeutral-95 border-t-blue-60 rounded-full animate-spin" />
          ) : (
            <CircularProgress
              value={isCurrent ? value : Math.abs(value)}
              max={isCurrent ? 200 : 100}
              suffix={isCurrent ? "점" : "%"}
              fractionDigits={isCurrent ? 1 : 2}
            />
          )}
        </div>

        <div className="flex flex-col gap-4 pb-[55px]">
          <TimeIndicator
            value={consumerPeriodType}
            onChange={onPeriodTypeChange}
          />
        </div>
      </div>

      <div className="w-full h-[222px] pr-4 pl-2 ">
        <BasicLineChart data={chartData} />
      </div>

      <div className="h-[62px]" />
    </>
  );
};

const StationIndexSection = ({ title }: Props) => {
  return (
    <>
      <div className="flex flex-col pt-[15px] pl-5">
        {/* 제목 */}
        <div className="text-base font-semibold text-coolNeutral-10">
          {title}
        </div>
        <div className="pt-[55px] pb-[83px]">
          <StationIndexBar></StationIndexBar>
        </div>
      </div>
    </>
  );
};

const IndexSectionHeader = ({
  title,
  date,
  selectedIndex,
  periodType,
  onPeriodTypeChange,
  consumerIndexData,
  isLoading,
  errorMessage,
}: Props) => {
  const currentIndex = selectedIndex ?? IndexState.rentIndex;

  const renderSection = () => {
    switch (currentIndex) {
      case IndexState.rentIndex:
        return (
          <RentIndexSection
            title={title}
            date={date}
            periodType={periodType}
            onPeriodTypeChange={onPeriodTypeChange}
          />
        );

      case IndexState.consumerIndex:
        return (
          <ConsumerIndexSection
            title={title}
            date={date}
            periodType={periodType}
            onPeriodTypeChange={onPeriodTypeChange}
            consumerIndexData={consumerIndexData}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        );

      case IndexState.stationIndex:
        return <StationIndexSection title={title} />;

      default:
        return null;
    }
  };

  return <div className="w-full">{renderSection()}</div>;
};

export default IndexSectionHeader;
