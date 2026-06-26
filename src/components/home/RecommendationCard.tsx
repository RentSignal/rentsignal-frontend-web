import LocationIcon from "@/assets/icons/home/location_pin.svg?react";
import RecommendationMap from "@/components/home/RecommendationMap";
import type { RecommendationCardProps } from "@/types/home";

const RecommendationCard = ({
  neighborhoodName,
  accessibilityScore,
  transportScore,
  latitude,
  longitude,
  onClick,
}: RecommendationCardProps) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onClick();
      }
    }}
    className="h-[92px] w-[129px] shrink-0 cursor-pointer overflow-hidden rounded-[12px] bg-coolNeutral-99 transition-shadow hover:shadow-md"
  >
    <RecommendationMap latitude={latitude} longitude={longitude} />
    <div className="px-[10px] pb-[8px] pt-[7px]">
      <div className="mb-[4px] flex items-center gap-[4px]">
        <LocationIcon className="h-[8px] w-[8px] shrink-0" />
        <h2 className="truncate text-[10px] font-semibold leading-[12px] text-black">
          {neighborhoodName}
        </h2>
      </div>
      <p className="truncate text-[8px] font-bold leading-[10px] text-coolNeutral-50">
        접근성: {accessibilityScore} / 교통: {transportScore}
      </p>
    </div>
  </div>
);

export default RecommendationCard;
