import { useEffect, useState } from "react";
import Divider from "../Divider";
import IndexSectionHeader, { IndexState } from "./section/InfoSectionHeader";
import RankingList from "../RankingList";
import { fetchDistrictSubwayDetail } from "@/services/homeApi";
import type { DistrictSubwayStation } from "@/services/homeApi";
import {
  fetchSubwayIndex,
  type SubwayIndexData,
  type SubwayIndexDistrictItem,
} from "@/services/infoApi";
import { useMapOverlayStore } from "@/store/mapOverlayStore";
import type { StationIndexDetail } from "./section/StationIndexSection";

const emptySubwayIndexData: SubwayIndexData = {
  high: [],
  changeRate: [],
  districtIndexes: [],
};

type SubwayRankingClickItem = {
  id?: number;
  neighborhoodId?: number;
  districtId?: number;
  name: string;
  value: number;
};

const normalizeDistrictName = (name: string) => name.replace(/\s/g, "");

const getDistrictId = (
  item: SubwayRankingClickItem,
  districtIndexes: SubwayIndexDistrictItem[],
) => {
  if (typeof item.districtId === "number") {
    return item.districtId;
  }

  if (typeof item.id === "number") {
    return item.id;
  }

  if (typeof item.neighborhoodId === "number") {
    return item.neighborhoodId;
  }

  const matchedDistrict = districtIndexes.find(
    (district) =>
      normalizeDistrictName(district.name) === normalizeDistrictName(item.name),
  );

  return matchedDistrict?.id;
};

const groupStationsByLine = (
  stations: DistrictSubwayStation[],
  subwayLines: string[],
) => {
  const groupedStationNames = new Map<string, string[]>();

  stations.forEach(({ lineName, stationName }) => {
    const stationNames = groupedStationNames.get(lineName) ?? [];

    if (!stationNames.includes(stationName)) {
      stationNames.push(stationName);
    }

    groupedStationNames.set(lineName, stationNames);
  });

  subwayLines.forEach((lineName) => {
    if (!groupedStationNames.has(lineName)) {
      groupedStationNames.set(lineName, []);
    }
  });

  return Array.from(groupedStationNames.entries()).map(
    ([lineName, stationNames]) => ({
      lineName,
      stationNames,
    }),
  );
};

const StationIndexPanel = () => {
  const [data, setData] = useState<SubwayIndexData>(emptySubwayIndexData);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [stationIndexDetail, setStationIndexDetail] =
    useState<StationIndexDetail | null>(null);
  const [isStationIndexDetailLoading, setIsStationIndexDetailLoading] =
    useState(false);
  const [stationIndexDetailErrorMessage, setStationIndexDetailErrorMessage] =
    useState("");
  const setSubwayIndexMapItems = useMapOverlayStore(
    (state) => state.setSubwayIndexItems,
  );
  const clearSubwayIndexMapItems = useMapOverlayStore(
    (state) => state.clearSubwayIndexItems,
  );

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const subwayIndexData = await fetchSubwayIndex();

        if (!isCancelled) {
          setData(subwayIndexData);
          setSubwayIndexMapItems(subwayIndexData.districtIndexes);
          setStationIndexDetail(null);
          setStationIndexDetailErrorMessage("");
        }
      } catch {
        if (!isCancelled) {
          setData(emptySubwayIndexData);
          clearSubwayIndexMapItems();
          setStationIndexDetail(null);
          setErrorMessage("지하철 역세권 지수 데이터를 불러오지 못했습니다.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
      clearSubwayIndexMapItems();
    };
  }, [clearSubwayIndexMapItems, setSubwayIndexMapItems]);

  const handleDistrictClick = async (item: SubwayRankingClickItem) => {
    const districtId = getDistrictId(item, data.districtIndexes);

    setStationIndexDetail({
      districtName: item.name,
      score: item.value,
      stationGroups: [],
    });
    setStationIndexDetailErrorMessage("");

    if (!districtId) {
      setStationIndexDetailErrorMessage(
        "선택한 지역의 지하철 상세 데이터를 찾지 못했습니다.",
      );
      return;
    }

    try {
      setIsStationIndexDetailLoading(true);

      const subwayDetail = await fetchDistrictSubwayDetail(districtId);
      const stationGroups = groupStationsByLine(
        subwayDetail.subwayStations,
        subwayDetail.subwayLines,
      );

      setStationIndexDetail({
        districtName: item.name,
        score: item.value,
        stationGroups,
      });
    } catch {
      setStationIndexDetailErrorMessage(
        "지하철 상세 데이터를 불러오지 못했습니다.",
      );
    } finally {
      setIsStationIndexDetailLoading(false);
    }
  };

  return (
    <>
      <IndexSectionHeader
        title="서울 지하철 역세권 지수"
        selectedIndex={IndexState.stationIndex}
        stationIndexDetail={stationIndexDetail}
        isStationIndexDetailLoading={isStationIndexDetailLoading}
        stationIndexDetailErrorMessage={stationIndexDetailErrorMessage}
      />
      <Divider />
      <div className="h-[32px]" />
      <div className="flex flex-col gap-[18px]">
        <RankingList
          title="지하철 역세권 지수 높은 지역 확인하기"
          showDropDown
          items={data.high}
          isLoading={isLoading}
          errorMessage={errorMessage}
          emptyMessage="표시할 지하철 역세권 지수 데이터가 없습니다."
          suffix=""
          fractionDigits={1}
          onItemClick={handleDistrictClick}
        />
      </div>
      <div className="h-[56px]" />
      <Divider />
      <div className="h-[32px]" />
      <div className="flex flex-col gap-[18px]">
        <RankingList
          title="증감률 높은 지역 확인하기"
          showDropDown
          items={data.changeRate}
          isLoading={isLoading}
          errorMessage={errorMessage}
          emptyMessage="표시할 지하철 역세권 지수 증감률 데이터가 없습니다."
          suffix="%"
          fractionDigits={2}
          onItemClick={handleDistrictClick}
        />
      </div>
      <div className="h-[100px]" />
    </>
  );
};

export default StationIndexPanel;
