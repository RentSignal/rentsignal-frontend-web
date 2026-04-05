import { useState, useMemo } from "react";
import CategoryToggle from "@/components/Info/CategoryToggle";
import ResidenceTypeToggle from "../ResidenceTypeToggle";
import Divider from "../Divider";
import RankingList from "../RankingList";
import IndexSectionHeader from "./section/InfoSectionHeader";
import InfoSectionToggle from "./section/InfoSectionToggle";

type ResidenceType = "OFFICETEL" | "VILLA";
type InfoSectionToggleType = "INFO" | "LIFESTYLE";

export const IndexState = {
  rentIndex: 0,
  consumerIndex: 1,
  stationIndex: 2,
} as const;

type IndexState = (typeof IndexState)[keyof typeof IndexState];

const InfoSection = () => {
  const [optionTabIndex, setOptionTabIndex] =
    useState<InfoSectionToggleType>("INFO");
  const [residenceType, setResidenceType] =
    useState<ResidenceType>("OFFICETEL");
  const [indexSelected, setIndexSelected] = useState("rent-index");
  const [facilitiesSelected, setFacilitiesSelected] = useState("facility");

  const indexItems = useMemo(() => {
    const popoverItems = [
      {
        id: "rent-index",
        label: "전월세 통합지수",
        title: "전월세 통합지수란?",
        description:
          "특정 지역의 전세와 월세 가격 흐름을 하나로 묶어, 지금 그 지역의 임대 시장이 어느 정도 수준인지를 한눈에 보여주는 지표입니다.",
      },
      {
        id: "consumer-index",
        label: "소비자 심리지수",
        title: "소비자 심리지수(Consumer Sentiment Index, CSI)란?",
        description:
          "소비자 심리지수는 소비자들이 현재와 미래의 경제 상황을 어떻게 인식하고 있는지를 수치로 나타낸 경기 체감 지표입니다. 소비·투자·주택·고용 등 경제 전반에 대한 심리 상태를 요약합니다.",
      },
      {
        id: "station-index",
        label: "지하철 역세권 지수",
        title: "지하철 역세권 지수란?",
        description:
          "주요 지하철역과의 접근성 및 가치를 지수로 표현한 것입니다.",
      },
    ];

    return popoverItems.map((item) => ({
      ...item,
      showPopover: item.id === indexSelected,
    }));
  }, [indexSelected]);

  const facilitiesItems = [
    { id: "facility", label: "편의시설" },
    { id: "transport", label: "교통" },
    { id: "safety", label: "치안" },
    { id: "cost", label: "비용" },
  ];

  return (
    <div className="w-full h-screen overflow-x-hidden overflow-y-auto no-scrollbar">
      {/* 지수중심, 생활요소 탭 버튼 영역 */}
      <InfoSectionToggle value={optionTabIndex} onChange={setOptionTabIndex} />

      {optionTabIndex === "INFO" && (
        <div className="flex flex-col items-start w-full ">
          <div className="flex items-center justify-center w-full pl-5">
            <CategoryToggle
              items={indexItems}
              value={indexSelected}
              onChange={setIndexSelected}
            />
          </div>
          {indexSelected === "rent-index" && (
            <>
              <div className="pl-5 duration-300 mt-7 animate-in fade-in">
                <ResidenceTypeToggle
                  value={residenceType}
                  onChange={setResidenceType}
                />
              </div>
              <div className="flex flex-col w-full pt-5 pl-5">
                <IndexSectionHeader
                  title="전월세 통합지수"
                  date="2026년 2월"
                  selectedIndex={IndexState.rentIndex}
                />
              </div>
              <div className="h-[56px]"></div>
              <Divider />
              <div className="h-[32px]"></div>
              <div className="flex flex-col gap-[18px]">
                <RankingList title="급상승 지역 확인하기" />
              </div>
              <div className="h-[56px]"></div>
              <Divider />
              <div className="h-[32px]"></div>
              <div className="flex flex-col gap-[18px]">
                <RankingList title="급하락 지역 확인하기" />
              </div>
              <div className="h-[100px]"></div>
            </>
          )}
          {indexSelected === "consumer-index" && (
            <>
              <IndexSectionHeader
                title="서울특별시 소비자 심리지수"
                date="2026년 2월"
                selectedIndex={IndexState.consumerIndex}
              />
              <Divider />
            </>
          )}
          {indexSelected === "station-index" && (
            <>
              <IndexSectionHeader
                title="서울 지하철 역세권 지수"
                selectedIndex={IndexState.stationIndex}
              />
              <Divider />
            </>
          )}
        </div>
      )}
      {optionTabIndex === "LIFESTYLE" && (
        <div className="flex flex-col gap-4 px-5 pb-10 mt-3">
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
export default InfoSection;
