import Divider from "../Divider";
import type {
  ConsumerIndexData,
  ConsumerIndexPeriodType,
} from "@/services/infoApi";
import IndexSectionHeader, { IndexState } from "./section/InfoSectionHeader";

type ConsumerIndexPanelProps = {
  periodType: ConsumerIndexPeriodType;
  onPeriodTypeChange: (value: ConsumerIndexPeriodType) => void;
  data: ConsumerIndexData | null;
  isLoading: boolean;
  errorMessage: string;
};

const ConsumerIndexPanel = ({
  periodType,
  onPeriodTypeChange,
  data,
  isLoading,
  errorMessage,
}: ConsumerIndexPanelProps) => {
  return (
    <>
      <IndexSectionHeader
        title="서울특별시 소비자 심리지수"
        selectedIndex={IndexState.consumerIndex}
        periodType={periodType}
        onPeriodTypeChange={onPeriodTypeChange}
        consumerIndexData={data}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
      <Divider />
    </>
  );
};

export default ConsumerIndexPanel;
