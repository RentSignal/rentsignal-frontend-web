import { useEffect, useState } from "react";
import SubwayItem from "@/components/home/SubwayItem";
import {
  fetchDistrictSubwayDetail,
  fetchSubwayAccessibilityRankings,
} from "@/services/homeApi";
import { useMapOverlayStore } from "@/store/mapOverlayStore";
import type { SubwayRankingWithDetails } from "@/types/home";
import { getSubwayLineOverlayData } from "@/utils/subwayLines";

const SubwayList = () => {
  const [subwayRankings, setSubwayRankings] = useState<
    SubwayRankingWithDetails[]
  >([]);
  const selectHomeSubwayRanking = useMapOverlayStore(
    (state) => state.selectHomeSubwayRanking,
  );
  const clearSelectedHomeSubwayRanking = useMapOverlayStore(
    (state) => state.clearSelectedHomeSubwayRanking,
  );
  const setSubwayLinePolylines = useMapOverlayStore(
    (state) => state.setSubwayLinePolylines,
  );
  const setSubwayStationMarkers = useMapOverlayStore(
    (state) => state.setSubwayStationMarkers,
  );

  useEffect(() => {
    let isMounted = true;

    const loadSubwayRankings = async () => {
      try {
        const data = await fetchSubwayAccessibilityRankings();
        const rankingsWithLines = await Promise.all(
          data.slice(0, 5).map(async (item) => {
            try {
              const subwayDetail = await fetchDistrictSubwayDetail(
                item.districtId,
              );
              return { ...item, ...subwayDetail };
            } catch {
              return { ...item, subwayLines: [], subwayStations: [] };
            }
          }),
        );

        if (isMounted) setSubwayRankings(rankingsWithLines);
      } catch {
        if (isMounted) setSubwayRankings([]);
      }
    };

    loadSubwayRankings();

    return () => {
      isMounted = false;
      clearSelectedHomeSubwayRanking();
    };
  }, [clearSelectedHomeSubwayRanking]);

  return (
    <>
      <div className="flex items-center justify-between px-[24px] mt-[50px]">
        <h3 className="text-[15px] font-semibold mb-[22px]">
          지하철 접근성이 높은 지역 TOP5
        </h3>
      </div>
      {subwayRankings.map((item) => (
        <SubwayItem
          key={item.rank}
          rank={item.rank}
          name={item.name}
          value={item.value}
          subwayLines={item.subwayLines}
          onClick={() => {
            const { polylines, stationMarkers } = getSubwayLineOverlayData(
              item.subwayStations,
            );
            selectHomeSubwayRanking(item);
            setSubwayLinePolylines(polylines);
            setSubwayStationMarkers(stationMarkers);
          }}
        />
      ))}
    </>
  );
};

export default SubwayList;
