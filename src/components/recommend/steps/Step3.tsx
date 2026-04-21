import { useState } from "react";

function SelectableItem({
  id,
  priority,
  onSelect,
}: {
  id: string;
  priority: Record<number, string>;
  onSelect: (id: string) => void;
}) {
  const order = Object.entries(priority).find(([, value]) => value === id)?.[0];

  return (
    <button
      onClick={() => onSelect(id)}
      className={`
        relative flex items-center justify-center  h-[40px]
        border rounded-lg
        ${order ? "border-blue-60 text-blue-60 bg-white font-semibold" : "border-coolNeutral-90  text-coolNeutral-30 font-medium"}
      `}
    >
      {/* 텍스트 */}
      <span className="text-base ">{id}</span>

      {/* 우선순위 뱃지 */}
      {order && (
        <div className="absolute flex items-center justify-center w-6 h-6 text-xs text-white rounded-full shadow -bottom-2 -right-2 bg-blue-60">
          {order}
        </div>
      )}
    </button>
  );
}

export default function Step3({
  value,
  onChange,
  onPrev,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  onPrev: () => void;
  onSubmit: (priority: Record<number, string>) => void;
}) {
  const preferOption = ["가성비", "편의시설"];
  const facilityOption = [
    "편의점",
    "카페",
    "병원",
    "약국",
    "음식점",
    "대형마트",
    "교통",
    "치안",
  ];

  const [priority, setPriority] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const isValid = value.length > 0;

  const handleSelect = (selected: string) => {
    setPriority((prev) => {
      const updated = { ...prev };

      // 이미 선택된 경우 → 제거 (toggle)
      const existingKey = Object.keys(updated).find(
        (key) => updated[Number(key)] === selected,
      );

      if (existingKey) {
        delete updated[Number(existingKey)];
        return updated;
      }

      // 빈 슬롯에 순서대로 추가 (1~5)
      for (let i = 1; i <= 5; i++) {
        if (!updated[i]) {
          updated[i] = selected;
          break;
        }
      }

      return updated;
    });
  };

  return (
    <div className="pt-[17px] px-5 flex flex-col gap-6">
      <div>
        <div className="flex flex-col gap-[6px] pt-[16px]">
          <h2 className="text-[22px] font-semibold text-coolNeutral-25">
            Step 3
          </h2>
          <p className="text-lg font-medium text-coolNeutral-25 ">
            우선순위로 둘 생활요소를 선택해주세요.
          </p>
        </div>

        {/* 상단 선택 */}
        <div className="flex gap-[10px] py-[26px]">
          {preferOption.map((item) => {
            const selected = value.includes(item);

            return (
              <button
                key={item}
                onClick={() => onChange(item)}
                className={`
                  px-[30px] py-2 border rounded-lg text-base
                  ${
                    selected
                      ? "bg-white text-blue-60 border-blue-60 font-semibold"
                      : "border-coolNeutral-90 font-medium text-coolNeutral-30"
                  }
                `}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* 편의시설 선택 */}
        {value === "편의시설" && (
          <div>
            <p className="text-lg font-medium text-coolNeutral-25 ">
              1순위부터 5순위 까지 우선순위를 정해주세요.
            </p>

            <div className="grid grid-cols-3 gap-[12px] my-[26px]">
              {facilityOption.map((item) => (
                <SelectableItem
                  key={item}
                  id={item}
                  priority={priority}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 px-[24px] pb-[24px] bg-white">
        <div className="flex gap-[10px] ">
          <button
            onClick={onPrev}
            className="w-[99px] text-[17px] font-semibold rounded-lg
                     bg-white text-coolNeutral-50 border border-b border-coolNeutral-95"
          >
            이전
          </button>

          <button
            onClick={async () => {
              setIsLoading(true);
              try {
                await onSubmit(priority);
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={!isValid}
            className={`
                flex-1 h-[51px] rounded-lg text-[17px] font-semibold
                ${
                  isValid
                    ? "bg-blue-60 text-white"
                    : "bg-coolNeutral-95 text-coolNeutral-30"
                }
              `}
          >
            맞춤 추천 보기
          </button>
        </div>
      </div>
    </div>
  );
}
