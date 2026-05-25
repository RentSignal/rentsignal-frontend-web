import { useState } from "react";
import RankingItem from "./RankingItem";
import DropDown from "./DropDown";
import type { RentIndexRankingItem } from "@/services/infoApi";

const dropdownItems = [{ value: "seoul", label: "서울특별시" }];

type RankingListProps = {
  title: string;
  showDropDown?: boolean;
  items?: RentIndexRankingItem[];
  isLoading?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  suffix?: string;
  fractionDigits?: number;
};

const RankingList = ({
  title,
  showDropDown = true,
  items,
  isLoading = false,
  errorMessage,
  emptyMessage = "표시할 데이터가 없습니다.",
  suffix = "%",
  fractionDigits = 2,
}: RankingListProps) => {
  const [value, setValue] = useState("seoul");
  const rankingItems = items ?? [];
  const isEmpty = rankingItems.length === 0;

  return (
    <div className="flex flex-col gap-[16px] items-start">
      <div className="pl-5 flex flex-col gap-[16px] items-start">
        <h2 className="text-xl font-semibold text-coolNeutral-10">{title}</h2>
        {showDropDown && (
          <DropDown
            items={dropdownItems}
            value={value}
            onChange={setValue}
            placeholder="지역 선택"
          />
        )}
      </div>
      <div className="w-full bg-white">
        {isLoading && (
          <div className="flex items-center justify-center py-[28px] px-[20px] w-[360px]">
            <div className="w-6 h-6 border-[3px] border-coolNeutral-95 border-t-blue-60 rounded-full animate-spin" />
          </div>
        )}
        {!isLoading && errorMessage && (
          <div className="py-[10px] px-[20px] w-[360px] text-sm text-coolNeutral-50">
            {errorMessage}
          </div>
        )}
        {!isLoading && !errorMessage && isEmpty && (
          <div className="py-[10px] px-[20px] w-[360px] text-sm text-coolNeutral-50">
            {emptyMessage}
          </div>
        )}
        {!isLoading &&
          !errorMessage &&
          !isEmpty &&
          rankingItems.map((item) => (
            <RankingItem
              key={item.rank}
              rank={item.rank}
              name={item.name}
              value={item.value}
              suffix={suffix}
              fractionDigits={fractionDigits}
            />
          ))}
      </div>
    </div>
  );
};

export default RankingList;
