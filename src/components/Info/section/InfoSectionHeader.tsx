import type { TimeIndicatorValue } from "@/components/TimeIndicator";
import type { ConsumerIndexData } from "@/services/infoApi";
import ConsumerIndexSection from "./ConsumerIndexSection";
import RentIndexSection from "./RentIndexSection";
import StationIndexSection, {
  type StationIndexDetail,
} from "./StationIndexSection";

export const IndexState = {
  rentIndex: 0,
  consumerIndex: 1,
  stationIndex: 2,
} as const;

type IndexState = (typeof IndexState)[keyof typeof IndexState];

type Props = {
  title: string;
  date?: string;
  selectedIndex?: IndexState;
  periodType?: TimeIndicatorValue;
  onPeriodTypeChange?: (value: TimeIndicatorValue) => void;
  consumerIndexData?: ConsumerIndexData | null;
  isLoading?: boolean;
  errorMessage?: string;
  stationIndexDetail?: StationIndexDetail | null;
  isStationIndexDetailLoading?: boolean;
  stationIndexDetailErrorMessage?: string;
};

const IndexSectionHeader = ({
  title,
  date,
  selectedIndex,
  periodType,
  onPeriodTypeChange,
  consumerIndexData,
  isLoading,
  errorMessage,
  stationIndexDetail,
  isStationIndexDetailLoading,
  stationIndexDetailErrorMessage,
}: Props) => {
  const currentIndex = selectedIndex ?? IndexState.rentIndex;

  const renderSection = () => {
    switch (currentIndex) {
      case IndexState.rentIndex:
        return (
          <RentIndexSection
            title={title}
            date={date}
            periodType={periodType}
            onPeriodTypeChange={onPeriodTypeChange}
          />
        );

      case IndexState.consumerIndex:
        return (
          <ConsumerIndexSection
            title={title}
            periodType={periodType}
            onPeriodTypeChange={onPeriodTypeChange}
            consumerIndexData={consumerIndexData}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        );

      case IndexState.stationIndex:
        return (
          <StationIndexSection
            title={title}
            detail={stationIndexDetail}
            isDetailLoading={isStationIndexDetailLoading}
            detailErrorMessage={stationIndexDetailErrorMessage}
          />
        );

      default:
        return null;
    }
  };

  return <div className="w-full">{renderSection()}</div>;
};

export default IndexSectionHeader;
