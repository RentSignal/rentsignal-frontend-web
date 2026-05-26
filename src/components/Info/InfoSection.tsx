import { useEffect, useMemo, useState } from "react";
import CategoryToggle from "@/components/Info/CategoryToggle";
import ResidenceTypeToggle from "../ResidenceTypeToggle";
import Divider from "../Divider";
import RankingList from "../RankingList";
import IndexSectionHeader from "./section/InfoSectionHeader";
import InfoSectionToggle from "./section/InfoSectionToggle";
import InfoAmenities from "./InfoAmenities";
import {
  fetchConsumerIndex,
  fetchRentIndexRankings,
  fetchRentIndexChangeRankings,
  type ConsumerIndexData,
  type ConsumerIndexPeriodType,
  type HousingType,
  type RentIndexChangePeriodType,
  type RentIndexChangeRankings,
  type RentIndexPeriodType,
  type RentIndexRankingItem,
} from "@/services/infoApi";
import { useMapOverlayStore } from "@/store/mapOverlayStore";

type InfoSectionToggleType = "INFO" | "LIFESTYLE";

export const IndexState = {
  rentIndex: 0,
  consumerIndex: 1,
  stationIndex: 2,
} as const;

type IndexState = (typeof IndexState)[keyof typeof IndexState];

const periodTypeMonthOffset: Record<RentIndexChangePeriodType, number> = {
  ONE_YEAR: 12,
  SIX_MONTH: 6,
  ONE_MONTH: 1,
};

const getIndexDateLabel = (periodType: RentIndexPeriodType) => {
  const monthOffset =
    periodType === "CURRENT" ? 0 : periodTypeMonthOffset[periodType];
  const date = new Date();
  date.setMonth(date.getMonth() - 1 - monthOffset);

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
};

const InfoSection = () => {
  const [optionTabIndex, setOptionTabIndex] =
    useState<InfoSectionToggleType>("INFO");
  const [residenceType, setResidenceType] = useState<HousingType>("APARTMENT");
  const [rentIndexPeriodType, setRentIndexPeriodType] =
    useState<RentIndexPeriodType>("ONE_YEAR");
  const [consumerIndexPeriodType, setConsumerIndexPeriodType] =
    useState<ConsumerIndexPeriodType>("ONE_YEAR");
  const [indexSelected, setIndexSelected] = useState("rent-index");
  const [facilitiesSelected, setFacilitiesSelected] = useState("facility");
  const [rentIndexChangeRankings, setRentIndexChangeRankings] =
    useState<RentIndexChangeRankings>({
      rise: [],
      fall: [],
    });
  const [currentRentIndexRankings, setCurrentRentIndexRankings] = useState<
    RentIndexRankingItem[]
  >([]);
  const [isRentIndexRankingsLoading, setIsRentIndexRankingsLoading] =
    useState(false);
  const [rentIndexRankingsError, setRentIndexRankingsError] = useState("");
  const [consumerIndexData, setConsumerIndexData] =
    useState<ConsumerIndexData | null>(null);
  const [isConsumerIndexLoading, setIsConsumerIndexLoading] = useState(false);
  const [consumerIndexError, setConsumerIndexError] = useState("");
  const setRentIndexMapItems = useMapOverlayStore(
    (state) => state.setRentIndexItems,
  );
  const clearRentIndexMapItems = useMapOverlayStore(
    (state) => state.clearRentIndexItems,
  );
  const selectRentIndexMapItem = useMapOverlayStore(
    (state) => state.selectRentIndexItem,
  );

  useEffect(() => {
    if (optionTabIndex !== "INFO" || indexSelected !== "rent-index") return;

    const controller = new AbortController();

    const fetchRankings = async () => {
      try {
        setIsRentIndexRankingsLoading(true);
        setRentIndexRankingsError("");

        if (rentIndexPeriodType === "CURRENT") {
          const rankings = await fetchRentIndexRankings(residenceType);

          if (!controller.signal.aborted) {
            setCurrentRentIndexRankings(rankings);
            setRentIndexChangeRankings({ rise: [], fall: [] });
            setRentIndexMapItems(
              rankings.map((item) => ({ ...item, type: "CURRENT" })),
            );
          }

          return;
        }

        const rankings = await fetchRentIndexChangeRankings({
          housingType: residenceType,
          periodType: rentIndexPeriodType,
        });

        if (!controller.signal.aborted) {
          setRentIndexChangeRankings(rankings);
          setCurrentRentIndexRankings([]);
          setRentIndexMapItems([
            ...rankings.rise.map((item) => ({ ...item, type: "RISE" as const })),
            ...rankings.fall.map((item) => ({ ...item, type: "FALL" as const })),
          ]);
        }
      } catch {
        if (!controller.signal.aborted) {
          setRentIndexRankingsError("랭킹 데이터를 불러오지 못했습니다.");
          setRentIndexChangeRankings({ rise: [], fall: [] });
          setCurrentRentIndexRankings([]);
          clearRentIndexMapItems();
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsRentIndexRankingsLoading(false);
        }
      }
    };

    fetchRankings();

    return () => controller.abort();
  }, [
    clearRentIndexMapItems,
    indexSelected,
    optionTabIndex,
    rentIndexPeriodType,
    residenceType,
    setRentIndexMapItems,
  ]);

  useEffect(() => {
    if (optionTabIndex !== "INFO" || indexSelected !== "consumer-index") {
      return;
    }

    const controller = new AbortController();

    const fetchIndex = async () => {
      try {
        setIsConsumerIndexLoading(true);
        setConsumerIndexError("");

        const data = await fetchConsumerIndex(consumerIndexPeriodType);

        if (!controller.signal.aborted) {
          setConsumerIndexData(data);
        }
      } catch {
        if (!controller.signal.aborted) {
          setConsumerIndexError("소비자 심리지수 데이터를 불러오지 못했습니다.");
          setConsumerIndexData(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsConsumerIndexLoading(false);
        }
      }
    };

    fetchIndex();

    return () => controller.abort();
  }, [consumerIndexPeriodType, indexSelected, optionTabIndex]);

  useEffect(() => {
    if (optionTabIndex === "INFO" && indexSelected === "rent-index") return;

    clearRentIndexMapItems();
  }, [clearRentIndexMapItems, indexSelected, optionTabIndex]);

  useEffect(() => {
    return () => clearRentIndexMapItems();
  }, [clearRentIndexMapItems]);

  const indexItems = useMemo(() => {
    const popoverItems = [
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
        description:
          "주요 지하철역과의 접근성 및 가치를 지수로 표현한 것입니다.",
      },
    ];

    return popoverItems.map((item) => ({
      ...item,
      showPopover: item.id === indexSelected,
    }));
  }, [indexSelected]);

  const facilitiesItems = [
    { id: "facility", label: "편의시설" },
    { id: "transport", label: "교통" },
    { id: "safety", label: "치안" },
  ];

  return (
    <div className="w-full h-screen overflow-x-hidden overflow-y-auto no-scrollbar">
      {/* 지수중심, 생활요소 탭 버튼 영역 */}
      <InfoSectionToggle value={optionTabIndex} onChange={setOptionTabIndex} />

      {optionTabIndex === "INFO" && (
        <div className="flex flex-col items-start w-full ">
          <div className="flex items-center justify-center w-full pl-5">
            <CategoryToggle
              items={indexItems}
              value={indexSelected}
              onChange={setIndexSelected}
            />
          </div>
          {indexSelected === "rent-index" && (
            <>
              <div className="pl-5 duration-300 mt-7 animate-in fade-in">
                <ResidenceTypeToggle
                  value={residenceType}
                  onChange={setResidenceType}
                />
              </div>
              <div className="flex flex-col w-full pt-5 pl-5">
                <IndexSectionHeader
                  title="전월세 통합지수"
                  date={getIndexDateLabel(rentIndexPeriodType)}
                  selectedIndex={IndexState.rentIndex}
                  periodType={rentIndexPeriodType}
                  onPeriodTypeChange={(value) => {
                    setRentIndexPeriodType(value);
                  }}
                />
              </div>
              <div className="h-[56px]"></div>
              <Divider />
              <div className="h-[32px]"></div>
              {rentIndexPeriodType === "CURRENT" ? (
                <div className="flex flex-col gap-[18px]">
                  <RankingList
                    title="현재 전월세 통합지수"
                    showDropDown
                    items={currentRentIndexRankings}
                    isLoading={isRentIndexRankingsLoading}
                    errorMessage={rentIndexRankingsError}
                    emptyMessage="표시할 전월세 통합지수 데이터가 없습니다."
                    suffix=""
                    fractionDigits={1}
                    onItemClick={(item) =>
                      selectRentIndexMapItem({ ...item, type: "CURRENT" })
                    }
                  />
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-[18px]">
                    <RankingList
                      title="급상승 지역 확인하기"
                      showDropDown
                      items={rentIndexChangeRankings.rise}
                      isLoading={isRentIndexRankingsLoading}
                      errorMessage={rentIndexRankingsError}
                      emptyMessage="표시할 급상승 데이터가 없습니다."
                      suffix="%"
                      fractionDigits={2}
                      onItemClick={(item) =>
                        selectRentIndexMapItem({ ...item, type: "RISE" })
                      }
                    />
                  </div>
                  <div className="h-[56px]"></div>
                  <Divider />
                  <div className="h-[32px]"></div>
                  <div className="flex flex-col gap-[18px]">
                    <RankingList
                      title="급하락 지역 확인하기"
                      showDropDown
                      items={rentIndexChangeRankings.fall}
                      isLoading={isRentIndexRankingsLoading}
                      errorMessage={rentIndexRankingsError}
                      emptyMessage="표시할 급하락 데이터가 없습니다."
                      suffix="%"
                      fractionDigits={2}
                      onItemClick={(item) =>
                        selectRentIndexMapItem({ ...item, type: "FALL" })
                      }
                    />
                  </div>
                </>
              )}
              <div className="h-[100px]"></div>
            </>
          )}
          {indexSelected === "consumer-index" && (
            <>
              <IndexSectionHeader
                title="서울특별시 소비자 심리지수"
                selectedIndex={IndexState.consumerIndex}
                periodType={consumerIndexPeriodType}
                onPeriodTypeChange={(value) => {
                  setConsumerIndexPeriodType(value);
                }}
                consumerIndexData={consumerIndexData}
                isLoading={isConsumerIndexLoading}
                errorMessage={consumerIndexError}
              />
              <Divider />
            </>
          )}
          {indexSelected === "station-index" && (
            <>
              <IndexSectionHeader
                title="서울 지하철 역세권 지수"
                selectedIndex={IndexState.stationIndex}
              />
              <Divider />
            </>
          )}
        </div>
      )}
      {optionTabIndex === "LIFESTYLE" && (
        <>
          <div className="flex flex-col gap-4 px-5 mt-3 h-[57px]">
            <CategoryToggle
              items={facilitiesItems}
              value={facilitiesSelected}
              onChange={setFacilitiesSelected}
            />
          </div>
          {facilitiesSelected === "facility" && (
            <>
              <InfoAmenities title={"노원구 공릉동"} />
              <Divider />
              <div className="flex flex-col gap-[18px] pt-5">
                <RankingList title="편의시설 상위 7곳" showDropDown={false} />
              </div>
              <div className="h-[150px]"></div>
            </>
          )}
        </>
      )}
    </div>
  );
};
export default InfoSection;
