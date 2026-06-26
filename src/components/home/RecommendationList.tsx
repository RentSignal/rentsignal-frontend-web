import { useEffect, useState } from "react";
import RightArrow from "@/assets/icons/home/recommendation_right_arrow.svg?react";
import RecommendationCard from "@/components/home/RecommendationCard";
import {
  fetchTodayRecommendations,
  type TodayRecommendation,
} from "@/services/homeApi";
import { useMapOverlayStore } from "@/store/mapOverlayStore";
import {
  getAccessibilityScore,
  getDisplayNeighborhoodName,
  getNeighborhoodCenter,
} from "@/utils/home";

const RecommendationList = () => {
  const [recommendations, setRecommendations] = useState<TodayRecommendation[]>(
    [],
  );
  const selectHomeRecommendation = useMapOverlayStore(
    (state) => state.selectHomeRecommendation,
  );
  const clearSelectedHomeRecommendation = useMapOverlayStore(
    (state) => state.clearSelectedHomeRecommendation,
  );

  useEffect(() => {
    let isMounted = true;

    const loadRecommendations = async () => {
      try {
        const data = await fetchTodayRecommendations();
        if (isMounted) setRecommendations(data);
      } catch {
        if (isMounted) setRecommendations([]);
      }
    };

    loadRecommendations();

    return () => {
      isMounted = false;
      clearSelectedHomeRecommendation();
    };
  }, [clearSelectedHomeRecommendation]);

  return (
    <section className="flex w-full min-w-0 flex-col gap-[14px]">
      <div className="flex items-center justify-between px-[24px]">
        <h3 className="text-[15px] font-semibold">오늘의 추천 지역</h3>
        <RightArrow />
      </div>
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex w-max gap-4 px-[24px]">
          {recommendations.map((recommendation) => {
            const { latitude, longitude } = getNeighborhoodCenter(
              recommendation.dongName,
            );

            return (
              <RecommendationCard
                key={`${recommendation.dongName}-${recommendation.rank}`}
                neighborhoodName={getDisplayNeighborhoodName(
                  recommendation.dongName,
                )}
                accessibilityScore={getAccessibilityScore(recommendation)}
                transportScore={recommendation.transport}
                latitude={latitude}
                longitude={longitude}
                onClick={() =>
                  selectHomeRecommendation(recommendation.dongName)
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecommendationList;
