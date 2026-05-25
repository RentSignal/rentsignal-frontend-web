type RankingItemProps = {
  rank: number;
  name: string;
  value: number;
  suffix?: string;
  fractionDigits?: number;
};

const RankingItem = ({
  rank,
  name,
  value,
  suffix = "%",
  fractionDigits = 2,
}: RankingItemProps) => {
  return (
    <div className="flex items-center justify-between py-[10px] px-[20px] w-[360px]">
      <div className="text-sm text-coolNeutral-30">{rank}</div>

      <div className="text-sm font-medium text-coolNeutral-30">{name}</div>

      <div className="text-sm font-medium text-blue-50">
        {value.toFixed(fractionDigits)}
        {suffix}
      </div>
    </div>
  );
};

export default RankingItem;
