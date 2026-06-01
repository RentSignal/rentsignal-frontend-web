import { useEffect, useState } from "react";
import Divider from "../Divider";
import IndexSectionHeader, { IndexState } from "./section/InfoSectionHeader";
import RankingList from "../RankingList";
import { fetchSubwayIndex, type SubwayIndexData } from "@/services/infoApi";
import { useMapOverlayStore } from "@/store/mapOverlayStore";

const emptySubwayIndexData: SubwayIndexData = {
  high: [],
  changeRate: [],
  districtIndexes: [],
};

const StationIndexPanel = () => {
  const [data, setData] = useState<SubwayIndexData>(emptySubwayIndexData);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
        }
      } catch {
        if (!isCancelled) {
          setData(emptySubwayIndexData);
          clearSubwayIndexMapItems();
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

  return (
    <>
      <IndexSectionHeader
        title="서울 지하철 역세권 지수"
        selectedIndex={IndexState.stationIndex}
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
        />
      </div>
      <div className="h-[100px]" />
    </>
  );
};

export default StationIndexPanel;
