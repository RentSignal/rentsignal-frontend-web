import { useEffect, useMemo, useState } from "react";
import CategoryToggle from "@/components/Info/CategoryToggle";
import Divider from "../Divider";
import RankingList, { type RankingListItem } from "../RankingList";
import InfoSectionToggle from "./section/InfoSectionToggle";
import InfoAmenities, { type InfoAmenityItem } from "./InfoAmenities";
import ConsumerIndexPanel from "./ConsumerIndexPanel";
import RentIndexPanel from "./RentIndexPanel";
import StationIndexPanel from "./StationIndexPanel";
import {
  facilitiesItems,
  indexItemsBase,
  type InfoFacilityId,
  type InfoIndexId,
  type InfoSectionToggleType,
} from "@/constants/infoSection";
import {
  fetchConvenienceDetail,
  fetchConvenienceInfo,
  type ConsumerIndexPeriodType,
  type ConvenienceCategoryKey,
  type ConvenienceDetail,
  type ConvenienceRankingItem,
  type HousingType,
  type RentIndexPeriodType,
} from "@/services/infoApi";
import { useConsumerIndex } from "@/hooks/useConsumerIndex";
import { useRentIndexRankings } from "@/hooks/useRentIndexRankings";
import { useMapOverlayStore } from "@/store/mapOverlayStore";

const InfoSection = () => {
  const [optionTabIndex, setOptionTabIndex] =
    useState<InfoSectionToggleType>("INFO");
  const [residenceType, setResidenceType] = useState<HousingType>("APARTMENT");
  const [rentIndexPeriodType, setRentIndexPeriodType] =
    useState<RentIndexPeriodType>("CURRENT");
  const [consumerIndexPeriodType, setConsumerIndexPeriodType] =
    useState<ConsumerIndexPeriodType>("CURRENT");
  const [indexSelected, setIndexSelected] = useState<InfoIndexId>("rent-index");
  const [facilitiesSelected, setFacilitiesSelected] =
    useState<InfoFacilityId>("facility");
  const [convenienceRankings, setConvenienceRankings] = useState<
    ConvenienceRankingItem[]
  >([]);
  const [isConvenienceLoading, setIsConvenienceLoading] = useState(false);
  const [convenienceErrorMessage, setConvenienceErrorMessage] = useState("");
  const [selectedConvenienceId, setSelectedConvenienceId] = useState<
    number | null
  >(null);
  const [selectedConvenienceDetail, setSelectedConvenienceDetail] =
    useState<ConvenienceDetail | null>(null);
  const [selectedConvenienceCategoryKey, setSelectedConvenienceCategoryKey] =
    useState<ConvenienceCategoryKey | null>(null);
  const [isConvenienceDetailLoading, setIsConvenienceDetailLoading] =
    useState(false);
  const [convenienceDetailErrorMessage, setConvenienceDetailErrorMessage] =
    useState("");
  const setConvenienceMapPins = useMapOverlayStore(
    (state) => state.setConveniencePins,
  );
  const clearConvenienceMapPins = useMapOverlayStore(
    (state) => state.clearConveniencePins,
  );

  const isInfoTab = optionTabIndex === "INFO";
  const isLifestyleTab = optionTabIndex === "LIFESTYLE";
  const isRentIndexActive = isInfoTab && indexSelected === "rent-index";
  const isConsumerIndexActive = isInfoTab && indexSelected === "consumer-index";
  const isConvenienceActive =
    isLifestyleTab && facilitiesSelected === "facility";
  const rentIndex = useRentIndexRankings({
    isActive: isRentIndexActive,
    residenceType,
    periodType: rentIndexPeriodType,
  });
  const consumerIndex = useConsumerIndex({
    isActive: isConsumerIndexActive,
    periodType: consumerIndexPeriodType,
  });

  useEffect(() => {
    if (!isConvenienceActive) {
      return;
    }

    const controller = new AbortController();

    const fetchRankings = async () => {
      try {
        setIsConvenienceLoading(true);
        setConvenienceErrorMessage("");

        const rankings = await fetchConvenienceInfo();

        if (!controller.signal.aborted) {
          setConvenienceRankings(rankings);
        }
      } catch {
        if (!controller.signal.aborted) {
          setConvenienceErrorMessage("편의시설 데이터를 불러오지 못했습니다.");
          setConvenienceRankings([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsConvenienceLoading(false);
        }
      }
    };

    fetchRankings();

    return () => controller.abort();
  }, [isConvenienceActive]);

  useEffect(() => {
    if (isConvenienceActive) {
      return;
    }

    setSelectedConvenienceId(null);
    setSelectedConvenienceDetail(null);
    setSelectedConvenienceCategoryKey(null);
    setConvenienceDetailErrorMessage("");
    setIsConvenienceDetailLoading(false);
    clearConvenienceMapPins();
  }, [clearConvenienceMapPins, isConvenienceActive]);

  const indexItems = useMemo(() => {
    return indexItemsBase.map((item) => ({
      ...item,
      showPopover: item.id === indexSelected,
    }));
  }, [indexSelected]);

  const convenienceRankingItems = useMemo(
    () =>
      convenienceRankings.map((item) => ({
        rank: item.rank,
        id: item.id,
        name: item.name,
        value: item.count,
      })),
    [convenienceRankings],
  );

  const selectedConvenienceItems = useMemo<InfoAmenityItem[]>(() => {
    if (!selectedConvenienceDetail) {
      return [];
    }

    return [
      {
        key: "mart",
        title: "대형마트",
        description: "대형 유통 매장 및 창고형 마트",
        qty: selectedConvenienceDetail.mart?.count ?? 0,
        conveniences: selectedConvenienceDetail.mart?.conveniences ?? [],
      },
      {
        key: "convenienceStore",
        title: "편의점",
        description: "주변 24시간 운영 편의점",
        qty: selectedConvenienceDetail.convenienceStore?.count ?? 0,
        conveniences:
          selectedConvenienceDetail.convenienceStore?.conveniences ?? [],
      },
      {
        key: "hospital",
        title: "병원",
        description: "동네 병원, 의원 및 전문의원",
        qty: selectedConvenienceDetail.hospital?.count ?? 0,
        conveniences: selectedConvenienceDetail.hospital?.conveniences ?? [],
      },
      {
        key: "cafe",
        title: "카페",
        description: "주변 카페 및 베이커리 디저트 매장",
        qty: selectedConvenienceDetail.cafe?.count ?? 0,
        conveniences: selectedConvenienceDetail.cafe?.conveniences ?? [],
      },
    ];
  }, [selectedConvenienceDetail]);

  const handleAmenityItemClick = (item: InfoAmenityItem) => {
    setSelectedConvenienceCategoryKey(item.key);
    setConvenienceMapPins(item.conveniences);
  };

  const handleConvenienceRankingClick = async (item: RankingListItem) => {
    const neighborhoodId = item.id ?? item.neighborhoodId;

    if (!neighborhoodId) {
      return;
    }

    if (isConvenienceDetailLoading && selectedConvenienceId === neighborhoodId) {
      return;
    }

    try {
      setSelectedConvenienceId(neighborhoodId);
      setSelectedConvenienceDetail(null);
      setSelectedConvenienceCategoryKey(null);
      clearConvenienceMapPins();
      setConvenienceDetailErrorMessage("");
      setIsConvenienceDetailLoading(true);

      const detail = await fetchConvenienceDetail(neighborhoodId);
      setSelectedConvenienceDetail(detail);
    } catch {
      setSelectedConvenienceDetail(null);
      setSelectedConvenienceCategoryKey(null);
      clearConvenienceMapPins();
      setConvenienceDetailErrorMessage(
        "편의시설 상세 데이터를 불러오지 못했습니다.",
      );
    } finally {
      setIsConvenienceDetailLoading(false);
    }
  };

  return (
    <div className="w-full h-screen overflow-x-hidden overflow-y-auto no-scrollbar">
      <InfoSectionToggle value={optionTabIndex} onChange={setOptionTabIndex} />

      {isInfoTab && (
        <div className="flex flex-col items-start w-full ">
          <div className="flex items-center justify-center w-full pl-5">
            <CategoryToggle
              items={indexItems}
              value={indexSelected}
              onChange={(value) => setIndexSelected(value as InfoIndexId)}
            />
          </div>
          {indexSelected === "rent-index" && (
            <RentIndexPanel
              residenceType={residenceType}
              onResidenceTypeChange={setResidenceType}
              periodType={rentIndexPeriodType}
              onPeriodTypeChange={setRentIndexPeriodType}
              currentRankings={rentIndex.currentRankings}
              changeRankings={rentIndex.changeRankings}
              isLoading={rentIndex.isLoading}
              errorMessage={rentIndex.errorMessage}
              onRankingItemClick={rentIndex.selectMapItem}
            />
          )}
          {indexSelected === "consumer-index" && (
            <ConsumerIndexPanel
              periodType={consumerIndexPeriodType}
              onPeriodTypeChange={setConsumerIndexPeriodType}
              data={consumerIndex.data}
              isLoading={consumerIndex.isLoading}
              errorMessage={consumerIndex.errorMessage}
            />
          )}
          {indexSelected === "station-index" && <StationIndexPanel />}
        </div>
      )}

      {optionTabIndex === "LIFESTYLE" && (
        <>
          <div className="flex flex-col gap-4 px-5 mt-3 h-[57px]">
            <CategoryToggle
              items={facilitiesItems}
              value={facilitiesSelected}
              onChange={(value) =>
                setFacilitiesSelected(value as InfoFacilityId)
              }
            />
          </div>
          {facilitiesSelected === "facility" && (
            <>
              {isConvenienceDetailLoading && (
                <div className="px-5 py-[10px] text-sm text-coolNeutral-50">
                  편의시설 상세 데이터를 불러오는 중입니다.
                </div>
              )}
              {!isConvenienceDetailLoading && convenienceDetailErrorMessage && (
                <div className="px-5 py-[10px] text-sm text-coolNeutral-50">
                  {convenienceDetailErrorMessage}
                </div>
              )}
              {selectedConvenienceDetail && (
                <>
                  <InfoAmenities
                    title={selectedConvenienceDetail.name}
                    items={selectedConvenienceItems}
                    selectedCategoryKey={selectedConvenienceCategoryKey}
                    onAmenityItemClick={handleAmenityItemClick}
                  />
                  <Divider />
                </>
              )}
              <div className="flex flex-col gap-[18px] pt-5">
                <RankingList
                  title="편의시설 상위 7곳"
                  showDropDown={false}
                  items={convenienceRankingItems}
                  isLoading={isConvenienceLoading}
                  errorMessage={convenienceErrorMessage}
                  emptyMessage="표시할 편의시설 데이터가 없습니다."
                  suffix="개"
                  fractionDigits={0}
                  onItemClick={handleConvenienceRankingClick}
                />
              </div>
              <div className="h-[150px]" />
            </>
          )}
        </>
      )}
    </div>
  );
};
export default InfoSection;
