import { useMemo, useState } from "react";
import CategoryToggle from "@/components/Info/CategoryToggle";
import Divider from "../Divider";
import RankingList from "../RankingList";
import InfoSectionToggle from "./section/InfoSectionToggle";
import InfoAmenities from "./InfoAmenities";
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
  type ConsumerIndexPeriodType,
  type HousingType,
  type RentIndexPeriodType,
} from "@/services/infoApi";
import { useConsumerIndex } from "@/hooks/useConsumerIndex";
import { useRentIndexRankings } from "@/hooks/useRentIndexRankings";

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

  const isInfoTab = optionTabIndex === "INFO";
  const isRentIndexActive = isInfoTab && indexSelected === "rent-index";
  const isConsumerIndexActive = isInfoTab && indexSelected === "consumer-index";
  const rentIndex = useRentIndexRankings({
    isActive: isRentIndexActive,
    residenceType,
    periodType: rentIndexPeriodType,
  });
  const consumerIndex = useConsumerIndex({
    isActive: isConsumerIndexActive,
    periodType: consumerIndexPeriodType,
  });

  const indexItems = useMemo(() => {
    return indexItemsBase.map((item) => ({
      ...item,
      showPopover: item.id === indexSelected,
    }));
  }, [indexSelected]);

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
              <InfoAmenities title={"노원구 공릉동"} />
              <Divider />
              <div className="flex flex-col gap-[18px] pt-5">
                <RankingList title="편의시설 상위 7곳" showDropDown={false} />
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
