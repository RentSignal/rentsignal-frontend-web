import { useState } from "react";
import CategoryToggle from "@/components/CategoryToggle";

const InfoToggle = () => {
  const [optionTabIndex, setOptionTabIndex] = useState(0);

  const facilitiesItems = [
    { id: "facility", label: "편의시설" },
    { id: "transport", label: "교통" },
    { id: "safety", label: "치안" },
    { id: "cost", label: "비용" },
  ];
  type CategoryItem = {
    id: string;
    label: string;
    showPopover?: boolean;
    title?: string;
    description?: string;
  };

  const indexItems = [
    {
      id: "rent-index",
      label: "전월세 통합지수",
      showPopover: true,
      title: "전월세 통합지수란?",
      description:
        "특정 지역의 전세와 월세 가격 흐름을 하나로 묶어, 지금 그 지역의 임대 시장이 어느 정도 수준인지 한눈에 보여주는 지표입니다.",
    },
    {
      id: "consumer-index",
      label: "소비자 심리지수",
      showPopover: false,
      title: "소비자 심리지수란?",
      description:
        "소비자들이 현재 경제 상황과 향후 경기 전망을 어떻게 인식하고 있는지를 보여주는 지표입니다.",
    },
    {
      id: "station-index",
      label: "지하철 역세권 지수",
      showPopover: false,
      title: "지하철 역세권 지수란?",
      description:
        "지하철 접근성을 기준으로 지역의 교통 편의성과 생활 인프라 수준을 평가한 지표입니다.",
    },
  ];
  const [indexSelected, setIndexSelected] = useState("rent-index");
  const [facilitiesSelected, setFacilitiesSelected] = useState("facility");
  return (
    <div className="pl-5">
      {/* 토글 영역 */}
      <div className="flex gap-3 pb-2">
        <button
          onClick={() => setOptionTabIndex(0)}
          className={`
            text-lg font-semibold   transition-colors
            ${
              optionTabIndex === 0
                ? "text-blue-50 border-b-2 border-blue-50"
                : "text-toggle_grey border-b-2 border-transparent"
            }
          `}
        >
          지수 중심
        </button>

        <button
          onClick={() => setOptionTabIndex(1)}
          className={`
            text-lg font-semibold   transition-colors
            ${
              optionTabIndex === 1
                ? "text-blue-50 border-b-2 border-blue-50"
                : "text-toggle_grey border-b-2 border-transparent"
            }
          `}
        >
          생활요소 중심
        </button>
      </div>

      {/* 레이아웃 분기 */}
      {optionTabIndex === 0 && (
        <div className="w-full mt-3">
          {/* 지수 중심 레이아웃 */}
          <CategoryToggle
            items={indexItems}
            value={indexSelected}
            onChange={setIndexSelected}
          />
        </div>
      )}
      {optionTabIndex === 1 && (
        <div className="flex flex-col gap-4 mt-3">
          {/* 생활요소 중심 레이아웃 */}
          <CategoryToggle
            items={facilitiesItems}
            value={facilitiesSelected}
            onChange={setFacilitiesSelected}
          />
        </div>
      )}
    </div>
  );
};

export default InfoToggle;
