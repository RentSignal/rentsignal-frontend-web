import { useState } from "react";
import PopOverIcon from "@/assets/icons/grey_popover_icon.svg?react";
import PopOverBlue from "@/assets/icons/blue_60_popover_icon.svg?react";
import PopOverClose from "@/assets/icons/popover_close.svg?react";
import TimeIndicator from "@/components/TimeIndicator";
import type { TimeIndicatorValue } from "@/components/TimeIndicator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import BasicLineChart from "../BasicLineChart";
import CircularProgress from "../CircularProgress";
import type {
  ConsumerIndexData,
  ConsumerIndexPeriodType,
} from "@/services/infoApi";
import { consumerIndexPhases } from "@/utils/consumerIndexPhase";

type ConsumerIndexSectionProps = {
  title: string;
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

const ConsumerIndexSection = ({
  title,
  periodType = "CURRENT",
  onPeriodTypeChange,
  consumerIndexData,
  isLoading = false,
  errorMessage,
}: ConsumerIndexSectionProps) => {
  const [open, setOpen] = useState(false);
  const consumerPeriodType = periodType as ConsumerIndexPeriodType;
  const hasData = Boolean(consumerIndexData);
  const value = consumerIndexData?.value ?? 0;
  const isCurrent = consumerPeriodType === "CURRENT";
  const isPositive = value > 0;
  const isNegative = value < 0;
  const trendText = !hasData
    ? "데이터 없음"
    : isCurrent
      ? `${value.toFixed(1)}점`
      : `${isPositive ? "▲" : isNegative ? "▼" : ""}${Math.abs(
          value,
        ).toFixed(2)}% ${isPositive ? "증가" : isNegative ? "감소" : "변동 없음"}`;
  const trendColor =
    !hasData || isCurrent
      ? "text-trend-neutral"
      : isPositive
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
        <div className="text-base font-semibold text-coolNeutral-10">
          {title}
        </div>

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
                  {consumerIndexPhases.map((item) => (
                    <div key={item.label} className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <p className="font-semibold">
                          <span>[</span>
                          <span className={item.textColorClass}>
                            {item.label}
                          </span>
                          <span>]</span>
                        </p>

                        <p className="text-sm font-semibold">{item.range}</p>
                      </div>

                      <p className="text-sm font-semibold leading-snug">
                        {item.description}
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
          ) : !hasData ? (
            <div className="flex items-center justify-center w-[140px] h-[140px] text-sm text-coolNeutral-50">
              데이터 없음
            </div>
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

export default ConsumerIndexSection;
