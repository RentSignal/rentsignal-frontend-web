import Divider from "../Divider";
import RankingList from "../RankingList";
import ResidenceTypeToggle from "../ResidenceTypeToggle";
import type {
  HousingType,
  RentIndexChangeRankings,
  RentIndexPeriodType,
  RentIndexRankingItem,
} from "@/services/infoApi";
import { getIndexDateLabel } from "@/constants/infoSection";
import IndexSectionHeader, { IndexState } from "./section/InfoSectionHeader";

type RentIndexPanelProps = {
  residenceType: HousingType;
  onResidenceTypeChange: (value: HousingType) => void;
  periodType: RentIndexPeriodType;
  onPeriodTypeChange: (value: RentIndexPeriodType) => void;
  currentRankings: RentIndexRankingItem[];
  changeRankings: RentIndexChangeRankings;
  isLoading: boolean;
  errorMessage: string;
  onRankingItemClick: (
    item: RentIndexRankingItem,
    type: "CURRENT" | "RISE" | "FALL",
  ) => void;
};

const RentIndexPanel = ({
  residenceType,
  onResidenceTypeChange,
  periodType,
  onPeriodTypeChange,
  currentRankings,
  changeRankings,
  isLoading,
  errorMessage,
  onRankingItemClick,
}: RentIndexPanelProps) => {
  return (
    <>
      <div className="pl-5 duration-300 mt-7 animate-in fade-in">
        <ResidenceTypeToggle
          value={residenceType}
          onChange={onResidenceTypeChange}
        />
      </div>
      <div className="flex flex-col w-full pt-5 pl-5">
        <IndexSectionHeader
          title="전월세 통합지수"
          date={getIndexDateLabel(periodType)}
          selectedIndex={IndexState.rentIndex}
          periodType={periodType}
          onPeriodTypeChange={onPeriodTypeChange}
        />
      </div>
      <div className="h-[56px]" />
      <Divider />
      <div className="h-[32px]" />
      {periodType === "CURRENT" ? (
        <div className="flex flex-col gap-[18px]">
          <RankingList
            title="현재 전월세 통합지수"
            showDropDown
            items={currentRankings}
            isLoading={isLoading}
            errorMessage={errorMessage}
            emptyMessage="표시할 전월세 통합지수 데이터가 없습니다."
            suffix=""
            fractionDigits={1}
            onItemClick={(item) => onRankingItemClick(item, "CURRENT")}
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-[18px]">
            <RankingList
              title="급상승 지역 확인하기"
              showDropDown
              items={changeRankings.rise}
              isLoading={isLoading}
              errorMessage={errorMessage}
              emptyMessage="표시할 급상승 데이터가 없습니다."
              suffix="%"
              fractionDigits={2}
              onItemClick={(item) => onRankingItemClick(item, "RISE")}
            />
          </div>
          <div className="h-[56px]" />
          <Divider />
          <div className="h-[32px]" />
          <div className="flex flex-col gap-[18px]">
            <RankingList
              title="급하락 지역 확인하기"
              showDropDown
              items={changeRankings.fall}
              isLoading={isLoading}
              errorMessage={errorMessage}
              emptyMessage="표시할 급하락 데이터가 없습니다."
              suffix="%"
              fractionDigits={2}
              onItemClick={(item) => onRankingItemClick(item, "FALL")}
            />
          </div>
        </>
      )}
      <div className="h-[100px]" />
    </>
  );
};

export default RentIndexPanel;
