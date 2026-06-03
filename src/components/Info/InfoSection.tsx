import { useEffect, useId, useMemo, useState } from "react";
import CategoryToggle from "@/components/Info/CategoryToggle";
import Divider from "../Divider";
import DropDown from "../DropDown";
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
  fetchSafetyInfo,
  fetchTransportDetail,
  fetchTransportInfo,
  type BusinessDistrictType,
  type ConsumerIndexPeriodType,
  type ConvenienceCategoryKey,
  type ConvenienceDetail,
  type ConvenienceRankingItem,
  type HousingType,
  type RentIndexPeriodType,
  type SafetyInfoData,
  type TransportCountItem,
  type TransportDetail,
  type TransportRecommendedNeighborhood,
  type TransportStationItem,
} from "@/services/infoApi";
import { useConsumerIndex } from "@/hooks/useConsumerIndex";
import { useRentIndexRankings } from "@/hooks/useRentIndexRankings";
import { useMapOverlayStore } from "@/store/mapOverlayStore";
import SafetyIndexBar from "@/assets/icons/safety_phrase.svg?react";

const businessDistrictItems = [
  { value: "GBD_GANGNAM", label: "강남역 출퇴근 추천 동네" },
  { value: "GBD_YEOKSAM", label: "역삼역 출퇴근 추천 동네" },
  { value: "GBD_SAMSEONG", label: "삼성역 출퇴근 추천 동네" },
  { value: "GBD_JAMSIL", label: "잠실역 출퇴근 추천 동네" },
  { value: "YBD_YEOUIDO", label: "여의도역 출퇴근 추천 동네" },
  { value: "YBD_YEOUINARU", label: "여의나루역 출퇴근 추천 동네" },
  { value: "YBD_DANGSAN", label: "당산역 출퇴근 추천 동네" },
  { value: "CBD_GWANGHWAMUN", label: "광화문역 출퇴근 추천 동네" },
  { value: "CBD_CITYHALL", label: "시청역 출퇴근 추천 동네" },
  { value: "CBD_JONGGAK", label: "종각역 출퇴근 추천 동네" },
] satisfies { value: BusinessDistrictType; label: string }[];

const emptySafetyInfoData: SafetyInfoData = {
  ranking: [],
  districtSafetyScores: [],
};

const getTravelTimeLabel = (station?: TransportStationItem) => {
  if (!station) {
    return "소요 시간 정보 없음";
  }

  const minutes = station.travelTimeMinutes;
  const seconds = station.travelTimeSeconds;

  if (seconds === 0) {
    return `약 ${minutes}분`;
  }

  return `약 ${minutes}분 ${seconds}초`;
};

const getSubwayLineLabel = (lineName: string) => {
  const match = lineName.match(/\d+/);
  return match?.[0] ?? lineName;
};

const isNumberLineLabel = (lineLabel: string) => /^\d+$/.test(lineLabel);

const subwayLineColorMap: Record<string, string> = {
  "1": "#2955A4",
  "2": "#00BA00",
  "3": "#D2683D",
  "4": "#3B66B6",
  "5": "#794B97",
  "6": "#96572A",
  "7": "#555D10",
  "8": "#B43667",
  "9": "#C6AF5B",
  신림선: "#3385FF",
  신분당선: "#D4003B",
  경부선: "#2955A4",
};

const getSubwayLineColor = (lineName: string) => {
  const lineLabel = getSubwayLineLabel(lineName);

  return subwayLineColorMap[lineLabel] ?? "#3385FF";
};

const transportCountMeta: Record<
  TransportCountItem["transportType"],
  { title: string; iconType: "bus" | "subway" }
> = {
  BUS_STOP: {
    title: "버스 정류장 수",
    iconType: "bus",
  },
  SUBWAY_STATION: {
    title: "인근 지하철역 수",
    iconType: "subway",
  },
};

const getClampedPercent = (percent: number) =>
  Math.max(0, Math.min(100, percent));

const BusFillShape = ({ fill }: { fill: string }) => (
  <>
    <path
      d="M18 21C18 14.3726 23.3726 9 30 9H66C72.6274 9 78 14.3726 78 21V70C78 76.6274 72.6274 82 66 82H30C23.3726 82 18 76.6274 18 70V21Z"
      fill={fill}
    />
    <rect x="8" y="33" width="10" height="20" rx="3" fill={fill} />
    <rect x="78" y="33" width="10" height="20" rx="3" fill={fill} />
    <rect x="25" y="78" width="14" height="14" rx="3" fill={fill} />
    <rect x="57" y="78" width="14" height="14" rx="3" fill={fill} />
  </>
);

const BusDetails = () => (
  <>
    <rect x="29" y="14" width="38" height="6" rx="2" fill="white" />
    <rect x="26" y="29" width="44" height="30" rx="4" fill="white" />
    <circle cx="31" cy="69" r="8" fill="white" />
    <circle cx="65" cy="69" r="8" fill="white" />
    <path d="M42 68H54L58 65V75L54 72H42L38 75V65L42 68Z" fill="white" />
  </>
);

const SubwayFillShape = ({ fill }: { fill: string }) => (
  <>
    <path
      d="M24 13C24 8.58172 27.5817 5 32 5H64C68.4183 5 72 8.58172 72 13V69C72 76.1797 66.1797 82 59 82H37C29.8203 82 24 76.1797 24 69V13Z"
      fill={fill}
    />
    <rect x="31" y="78" width="10" height="14" rx="3" fill={fill} />
    <rect x="55" y="78" width="10" height="14" rx="3" fill={fill} />
  </>
);

const SubwayDetails = () => (
  <>
    <rect x="32" y="13" width="32" height="6" rx="2" fill="white" />
    <rect x="31" y="30" width="34" height="28" rx="4" fill="white" />
    <circle cx="35" cy="68" r="6" fill="white" />
    <circle cx="61" cy="68" r="6" fill="white" />
    <rect x="42" y="66" width="12" height="5" rx="2" fill="white" />
  </>
);

const FilledTransportIcon = ({
  type,
  percent,
}: {
  type: "bus" | "subway";
  percent: number;
}) => {
  const clipId = `transport-fill-${useId().replaceAll(":", "")}`;
  const clampedPercent = getClampedPercent(percent);
  const visibleHeight = (96 * clampedPercent) / 100;
  const hiddenY = 96 - visibleHeight;
  const Shape = type === "bus" ? BusFillShape : SubwayFillShape;
  const Details = type === "bus" ? BusDetails : SubwayDetails;

  return (
    <svg viewBox="0 0 96 96" className="w-12 h-12" aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y={hiddenY} width="96" height={visibleHeight} />
        </clipPath>
      </defs>
      <Shape fill="#E2E3E4" />
      <g clipPath={`url(#${clipId})`}>
        <Shape fill="#6EA3FF" />
      </g>
      <Details />
    </svg>
  );
};

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
  const [businessDistrictType, setBusinessDistrictType] =
    useState<BusinessDistrictType>("GBD_GANGNAM");
  const [businessDistrictSelectKey, setBusinessDistrictSelectKey] = useState(0);
  const [transportNeighborhoods, setTransportNeighborhoods] = useState<
    TransportRecommendedNeighborhood[]
  >([]);
  const [isTransportLoading, setIsTransportLoading] = useState(false);
  const [transportErrorMessage, setTransportErrorMessage] = useState("");
  const [selectedTransportDetail, setSelectedTransportDetail] =
    useState<TransportDetail | null>(null);
  const [isTransportDetailLoading, setIsTransportDetailLoading] =
    useState(false);
  const [transportDetailErrorMessage, setTransportDetailErrorMessage] =
    useState("");
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
  const [safetyInfoData, setSafetyInfoData] =
    useState<SafetyInfoData>(emptySafetyInfoData);
  const [isSafetyLoading, setIsSafetyLoading] = useState(false);
  const [safetyErrorMessage, setSafetyErrorMessage] = useState("");
  const setConvenienceMapPins = useMapOverlayStore(
    (state) => state.setConveniencePins,
  );
  const clearConvenienceMapPins = useMapOverlayStore(
    (state) => state.clearConveniencePins,
  );
  const setSafetyIndexMapItems = useMapOverlayStore(
    (state) => state.setSafetyIndexItems,
  );
  const clearSafetyIndexMapItems = useMapOverlayStore(
    (state) => state.clearSafetyIndexItems,
  );

  const isInfoTab = optionTabIndex === "INFO";
  const isLifestyleTab = optionTabIndex === "LIFESTYLE";
  const isRentIndexActive = isInfoTab && indexSelected === "rent-index";
  const isConsumerIndexActive = isInfoTab && indexSelected === "consumer-index";
  const isConvenienceActive =
    isLifestyleTab && facilitiesSelected === "facility";
  const isTransportActive =
    isLifestyleTab && facilitiesSelected === "transport";
  const isSafetyActive = isLifestyleTab && facilitiesSelected === "safety";
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

  useEffect(() => {
    if (!isTransportActive) {
      setTransportNeighborhoods([]);
      setTransportErrorMessage("");
      setIsTransportLoading(false);
      setSelectedTransportDetail(null);
      setTransportDetailErrorMessage("");
      setIsTransportDetailLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchNeighborhoods = async () => {
      try {
        setIsTransportLoading(true);
        setTransportErrorMessage("");
        setSelectedTransportDetail(null);
        setTransportDetailErrorMessage("");

        const neighborhoods = await fetchTransportInfo(businessDistrictType);

        if (!controller.signal.aborted) {
          setTransportNeighborhoods(neighborhoods);
        }
      } catch {
        if (!controller.signal.aborted) {
          setTransportNeighborhoods([]);
          setTransportErrorMessage("교통 추천 동네를 불러오지 못했습니다.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsTransportLoading(false);
        }
      }
    };

    fetchNeighborhoods();

    return () => controller.abort();
  }, [businessDistrictSelectKey, businessDistrictType, isTransportActive]);

  useEffect(() => {
    if (!isSafetyActive) {
      setSafetyInfoData(emptySafetyInfoData);
      setSafetyErrorMessage("");
      setIsSafetyLoading(false);
      clearSafetyIndexMapItems();
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setIsSafetyLoading(true);
        setSafetyErrorMessage("");

        const data = await fetchSafetyInfo();

        if (!controller.signal.aborted) {
          setSafetyInfoData(data);
          setSafetyIndexMapItems(data.districtSafetyScores);
        }
      } catch {
        if (!controller.signal.aborted) {
          setSafetyInfoData(emptySafetyInfoData);
          clearSafetyIndexMapItems();
          setSafetyErrorMessage("주거안전도 데이터를 불러오지 못했습니다.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSafetyLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
      clearSafetyIndexMapItems();
    };
  }, [clearSafetyIndexMapItems, isSafetyActive, setSafetyIndexMapItems]);

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
    setConvenienceMapPins(item.conveniences, item.key);
  };

  const handleBusinessDistrictSelect = (value: string) => {
    setBusinessDistrictType(value as BusinessDistrictType);
    setBusinessDistrictSelectKey((prev) => prev + 1);
  };

  const handleConvenienceRankingClick = async (item: RankingListItem) => {
    const neighborhoodId = item.id ?? item.neighborhoodId;

    if (!neighborhoodId) {
      return;
    }

    if (
      isConvenienceDetailLoading &&
      selectedConvenienceId === neighborhoodId
    ) {
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

  const handleTransportNeighborhoodClick = async (
    neighborhood: TransportRecommendedNeighborhood,
  ) => {
    try {
      setSelectedTransportDetail(null);
      setTransportDetailErrorMessage("");
      setIsTransportDetailLoading(true);

      const detail = await fetchTransportDetail(neighborhood.id);

      setSelectedTransportDetail(detail);
    } catch {
      setSelectedTransportDetail(null);
      setTransportDetailErrorMessage("교통 상세 데이터를 불러오지 못했습니다.");
    } finally {
      setIsTransportDetailLoading(false);
    }
  };

  const handleSafetyRankingClick = (item: RankingListItem) => {
    setSafetyIndexMapItems([{ name: item.name, value: item.value }]);
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
                  <div className="mb-[32px]">
                    {" "}
                    <InfoAmenities
                      title={selectedConvenienceDetail.name}
                      items={selectedConvenienceItems}
                      selectedCategoryKey={selectedConvenienceCategoryKey}
                      onAmenityItemClick={handleAmenityItemClick}
                    />
                    <Divider />
                  </div>
                </>
              )}
              <div className="flex flex-col gap-[18px]">
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
          {facilitiesSelected == "transport" && (
            <>
              <div className="flex flex-col gap-[23px]">
                <div className="flex flex-col gap-[23px] px-5">
                  <h2 className="text-xl font-semibold text-coolNeutral-10">
                    주요 업무지구 평균 접근 추천 동네
                  </h2>
                  <DropDown
                    items={businessDistrictItems}
                    value={businessDistrictType}
                    onChange={(value) =>
                      setBusinessDistrictType(value as BusinessDistrictType)
                    }
                    onItemSelect={handleBusinessDistrictSelect}
                    placeholder="업무지구 선택"
                    size="lg"
                    width="w-full"
                  />
                </div>
                <div className="flex flex-col gap-5 mb-20">
                  {(isTransportLoading || isTransportDetailLoading) && (
                    <div className="flex items-center justify-center py-[28px]">
                      <div className="w-6 h-6 border-[3px] border-coolNeutral-95 border-t-blue-60 rounded-full animate-spin" />
                    </div>
                  )}
                  {!isTransportLoading &&
                    !isTransportDetailLoading &&
                    transportErrorMessage && (
                      <div className="px-5 py-[10px] text-sm text-coolNeutral-50">
                        {transportErrorMessage}
                      </div>
                    )}
                  {!isTransportLoading &&
                    !isTransportDetailLoading &&
                    transportDetailErrorMessage && (
                      <div className="px-5 py-[10px] text-sm text-coolNeutral-50">
                        {transportDetailErrorMessage}
                      </div>
                    )}
                  {!isTransportLoading &&
                    !isTransportDetailLoading &&
                    selectedTransportDetail && (
                      <>
                        <div className="px-5 pt-1">
                          <h3 className="text-lg font-bold text-coolNeutral-10">
                            {selectedTransportDetail.name}
                          </h3>
                        </div>

                        <section className="flex flex-col gap-4 px-5 pt-3">
                          <h4 className="text-base font-bold text-coolNeutral-10">
                            주변 지하철
                          </h4>
                          <div className="flex flex-col gap-3">
                            {selectedTransportDetail.subwayStations.map(
                              (station) => {
                                const lineLabel = getSubwayLineLabel(
                                  station.lineName,
                                );
                                const isNumberLine =
                                  isNumberLineLabel(lineLabel);

                                return (
                                  <div
                                    key={`${station.lineName}-${station.stationName}`}
                                    className="flex items-center gap-2"
                                  >
                                    <span
                                      className={`flex h-6 items-center justify-center whitespace-nowrap rounded-full text-xs font-bold text-white ${
                                        isNumberLine
                                          ? "w-6"
                                          : "min-w-[44px] px-2 text-[10px]"
                                      }`}
                                      style={{
                                        backgroundColor: getSubwayLineColor(
                                          station.lineName,
                                        ),
                                      }}
                                    >
                                      {lineLabel}
                                    </span>
                                    <span className="text-sm font-medium text-coolNeutral-25">
                                      {station.stationName}
                                    </span>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </section>

                        <Divider />

                        <section className="flex flex-col gap-4 px-5 pt-6">
                          <h4 className="text-base font-bold text-coolNeutral-10">
                            주변 버스
                          </h4>
                          <div className="flex gap-[34px]">
                            {selectedTransportDetail.counts.map((item) => {
                              const meta =
                                transportCountMeta[item.transportType];

                              return (
                                <div
                                  key={item.transportType}
                                  className="flex min-w-[72px] flex-col items-start gap-2"
                                >
                                  <div>
                                    <div className="text-xs font-bold text-coolNeutral-10">
                                      {item.count}개
                                    </div>
                                    <div className="text-[11px] font-medium text-coolNeutral-25">
                                      평균 대비 {item.ratioToAverage}%
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-center w-12 h-12">
                                    <FilledTransportIcon
                                      type={meta.iconType}
                                      percent={item.ratioToAverage}
                                    />
                                  </div>
                                  <div className="text-xs font-medium text-coolNeutral-25">
                                    {meta.title}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </section>
                      </>
                    )}
                  {!isTransportLoading &&
                    !isTransportDetailLoading &&
                    !selectedTransportDetail &&
                    !transportErrorMessage &&
                    transportNeighborhoods.length === 0 && (
                      <div className="px-5 py-[10px] text-sm text-coolNeutral-50">
                        표시할 교통 추천 동네가 없습니다.
                      </div>
                    )}
                  {!isTransportLoading &&
                    !isTransportDetailLoading &&
                    !selectedTransportDetail &&
                    !transportErrorMessage &&
                    transportNeighborhoods.map((neighborhood) => {
                      const primaryStation = neighborhood.stations[0];

                      return (
                        <button
                          type="button"
                          key={neighborhood.id}
                          onClick={() =>
                            handleTransportNeighborhoodClick(neighborhood)
                          }
                          className="mx-5 rounded-[12px] border-[1px] border-coolNeutral-95 bg-white px-[18px] py-[18px] text-left shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition-colors hover:bg-coolNeutral-99"
                        >
                          <h4 className="text-lg font-semibold text-coolNeutral-25">
                            {neighborhood.name}
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-[5px]">
                            <span className="rounded-full border border-blue-70 px-[10px] py-[6px] text-sm font-medium text-coolNeutral-30">
                              {primaryStation?.stationName ?? "역 정보 없음"}
                            </span>
                            <span className="rounded-full border border-blue-70 px-[10px] py-[6px] text-sm font-medium text-coolNeutral-30">
                              {getTravelTimeLabel(primaryStation)}
                            </span>
                            {primaryStation && (
                              <span className="rounded-full border border-blue-70 px-[10px] py-[6px] text-sm font-medium text-coolNeutral-30">
                                {primaryStation.lineName}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            </>
          )}
          {facilitiesSelected == "safety" && (
            <>
              <div className="flex px-5 mb-[83px]">
                <SafetyIndexBar />
              </div>
              <div className="mb-[32px]">
                <Divider />
              </div>
              <div className="flex flex-col gap-[18px]">
                <RankingList
                  title="주거안전도 상위 지역"
                  showDropDown={false}
                  items={safetyInfoData.ranking}
                  isLoading={isSafetyLoading}
                  errorMessage={safetyErrorMessage}
                  emptyMessage="표시할 주거안전도 데이터가 없습니다."
                  suffix="점"
                  fractionDigits={1}
                  onItemClick={handleSafetyRankingClick}
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
