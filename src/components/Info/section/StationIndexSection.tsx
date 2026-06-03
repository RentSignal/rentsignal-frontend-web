import StationIndexBar from "@/assets/icons/station_phrase.svg?react";

type StationIndexSectionProps = {
  title: string;
};

const StationIndexSection = ({ title }: StationIndexSectionProps) => {
  return (
    <div className="flex flex-col pt-[15px] pl-5">
      <div className="text-base font-semibold text-coolNeutral-10">{title}</div>
      <div className="pt-[55px] pb-[83px]">
        <StationIndexBar />
      </div>
    </div>
  );
};

export default StationIndexSection;
