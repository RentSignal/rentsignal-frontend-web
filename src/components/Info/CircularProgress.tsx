type Props = {
  value: number;
};

const CircularProgress = ({ value }: Props) => {
  const size = 140;

  const bgStroke = 7;
  const progressStroke = 21;

  const center = size / 2;

  const bgRadius = 56;
  const progressRadius = (size - progressStroke) / 2;

  const circumference = 2 * Math.PI * progressRadius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="w-[140px] h-[140px] relative">
      <svg height={size} width={size}>
        {/* 배경 원 */}
        <circle
          stroke="#FF0000"
          fill="transparent"
          strokeWidth={bgStroke}
          opacity={0.35}
          r={bgRadius}
          cx={center}
          cy={center}
        />

        {/* 진행 원 */}
        <circle
          stroke="#FF0000"
          fill="transparent"
          strokeWidth={progressStroke}
          opacity={0.35}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={progressRadius}
          cx={center}
          cy={center}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            transition: "stroke-dashoffset 0.5s ease",
          }}
        />
      </svg>

      {/* 중앙 텍스트 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[24.5px] font-medium text-coolNeutral-25">
          {value}%
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;
