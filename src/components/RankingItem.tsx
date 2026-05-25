type RankingItemProps = {
  rank: number;
  name: string;
  value: number;
  suffix?: string;
  fractionDigits?: number;
  onClick?: () => void;
};

const RankingItem = ({
  rank,
  name,
  value,
  suffix = "%",
  fractionDigits = 2,
  onClick,
}: RankingItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between py-[10px] px-[24px] w-[376px] text-left transition-colors hover:bg-coolNeutral-99 disabled:hover:bg-transparent"
      disabled={!onClick}
    >
      <div className="text-sm text-coolNeutral-30">{rank}</div>

      <div className="text-sm font-medium text-coolNeutral-30">{name}</div>

      <div className="text-sm font-medium text-blue-50">
        {value.toFixed(fractionDigits)}
        {suffix}
      </div>
    </button>
  );
};

export default RankingItem;
