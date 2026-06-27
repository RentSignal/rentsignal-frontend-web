import { useNavigate } from "react-router-dom";
import LineChartIcon from "@/assets/icons/home/home_linechart.png";
import RecommendationIcon from "@/assets/icons/home/home_recommendation.png";
import ReviewIcon from "@/assets/icons/home/home_review.png";
import RisingIcon from "@/assets/icons/home/home_rising.png";
import IconButton from "@/components/home/IconButton";

const HeaderSection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex  justify-between  px-5 mt-4 mb-[30px]">
      <IconButton
        icon={RisingIcon}
        label="급상승 지역"
        iconWidth="30"
        iconHeight="42"
        onClick={() => navigate("/info")}
      />
      <IconButton
        icon={RecommendationIcon}
        label="AI 추천 지역"
        iconWidth="30"
        iconHeight="42"
        onClick={() => navigate("/recommend")}
      />
      <IconButton
        icon={LineChartIcon}
        label="전월세 통합지수"
        iconWidth="36"
        iconHeight="30"
        onClick={() => navigate("/info")}
      />
      <IconButton
        icon={ReviewIcon}
        label="거주 리뷰"
        iconWidth="28"
        iconHeight="28"
        onClick={() => navigate("/community")}
      />
    </div>
  );
};

export default HeaderSection;
