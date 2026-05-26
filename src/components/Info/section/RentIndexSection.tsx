import TimeIndicator from "@/components/TimeIndicator";
import type { TimeIndicatorValue } from "@/components/TimeIndicator";

type RentIndexSectionProps = {
  title: string;
  date?: string;
  periodType?: TimeIndicatorValue;
  onPeriodTypeChange?: (value: TimeIndicatorValue) => void;
};

const RentIndexSection = ({
  title,
  date,
  periodType = "CURRENT",
  onPeriodTypeChange,
}: RentIndexSectionProps) => {
  return (
    <>
      <div className="text-base font-semibold text-coolNeutral-10">{title}</div>

      <div>
        <div className="flex items-center justify-end pr-5">
          <div className="font-medium text-[14px] text-coolNeutral-30">
            {date}
          </div>
        </div>
        <div className="pt-[40px]">
          <TimeIndicator value={periodType} onChange={onPeriodTypeChange} />
        </div>
      </div>
    </>
  );
};

export default RentIndexSection;
