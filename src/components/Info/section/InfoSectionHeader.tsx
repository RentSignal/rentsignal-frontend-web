import TimeIndicator from "@/components/TimeIndicator";

type Props = {
  title: string;
  date: string;
  disabled?: boolean;
};

const InfoSectionHeader = ({ title, date, disabled = false }: Props) => {
  return (
    <div className="flex flex-col w-full pt-5 pl-5">
      <div className="text-base font-semibold text-coolNeutral-10">{title}</div>

      <div className="flex justify-end pr-5 pt-[7px] font-medium text-[14px] text-coolNeutral-30">
        {date}
      </div>

      <div className="h-8" />

      <div className="flex flex-col gap-4">
        {!disabled && <TimeIndicator />}
      </div>
    </div>
  );
};

export default InfoSectionHeader;
