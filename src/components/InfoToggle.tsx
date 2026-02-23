import { useState } from "react";
import CategoryToggle from "@/components/CategoryToggle";

const InfoToggle = () => {
  const [optionTabIndex, setOptionTabIndex] = useState(0); 

  const facilitiesItems = ["편의시설", "교통", "치안", "비용"];
  const [facilitiesSelected, setfacilitiesSelected] = useState("편의시설");

  const indexItems = ["전월세 통합지수", "소비자 심리지수", "지하철 역세권 지수"];
  const [indexSelected, setIndexSelected] = useState("전월세 통합지수");

  return (
    <div className="pl-5">
      {/* 토글 영역 */}
      <div className="flex gap-3 pb-2">
        <button
          onClick={() => setOptionTabIndex(0)}
          className={`
            text-lg font-semibold   transition-colors
            ${optionTabIndex === 0
              ? "text-blue-50 border-b-2 border-blue-50"
              : "text-toggle_grey border-b-2 border-transparent"}
          `}
        >
          지수 중심
        </button>

        <button
          onClick={() => setOptionTabIndex(1)}
          className={`
            text-lg font-semibold   transition-colors
            ${optionTabIndex === 1
              ? "text-blue-50 border-b-2 border-blue-50"
              : "text-toggle_grey border-b-2 border-transparent"}
          `}
        >
          생활요소 중심
        </button>
      </div>

      {/* 레이아웃 분기 */}
      {optionTabIndex === 0 && (
        <div className="mt-3 w-full">
          {/* 지수 중심 레이아웃 */}
          <CategoryToggle
            items={indexItems}
            value={indexSelected}
            onChange={setIndexSelected}
          />
        </div>
      )}
      {optionTabIndex === 1 && (
        <div className="mt-3 flex flex-col gap-4">
          {/* 생활요소 중심 레이아웃 */}
          <CategoryToggle
            items={facilitiesItems}
            value={facilitiesSelected}
            onChange={setfacilitiesSelected}
          />
        </div>
      )}
    </div>
  );
};

export default InfoToggle;