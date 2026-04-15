export default function Step2({
  value,
  onChange,
  onPrev,
  onNext,
}: {
  value: {
    houseType: string;
    rentType: string;
  };
  onChange: (v: { houseType: string; rentType: string }) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const handleSelect = (key: "houseType" | "rentType", v: string) => {
    onChange({
      ...value,
      [key]: v,
    });
  };
  const housingOption = ["오피스텔", "원룸"];
  const rentOption = ["월세", "전세"];

  const isValid = value.houseType && value.rentType;

  return (
    <div className="flex flex-col min-h-screen gap-6 px-6">
      <div>
        <div className="flex flex-col gap-[6px] pt-[16px] pb-[10px]">
          <h2 className="text-[22px] font-semibold text-coolNeutral-25">
            Step 2
          </h2>
          <p className="text-lg font-medium text-coolNeutral-25 ">
            주거 형태를 선택해주세요.
          </p>
        </div>
        <div className="flex gap-[5px] mt-2">
          {housingOption.map((item) => (
            <button
              key={item}
              onClick={() => handleSelect("houseType", item)}
              className={`
                flex-1 px-3 py-2 border rounded-lg
                ${
                  value.houseType === item
                    ? "bg-blue-60 text-white border-blue-60"
                    : "border-gray-300"
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-[24px]">
        <p className="text-lg font-medium text-coolNeutral-25 ">
          계약형태를 선택해주세요.
        </p>

        <div className="flex gap-[10px] py-[26px]">
          {rentOption.map((item) => (
            <button
              key={item}
              onClick={() => handleSelect("rentType", item)}
              className={`
                px-[30px] py-[11px] border rounded-lg
                ${
                  value.rentType === item
                    ? "bg-white text-blue-60 border-blue-60"
                    : "border-gray-300"
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* 다음 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 px-[24px] py-[24px]">
        <div className="flex gap-[10px] ">
          <button
            onClick={onPrev}
            className="w-[99px] py-[19px] text-sm font-bold rounded-lg
                     bg-white text-coolNeutral-50 border border-b border-coolNeutral-95"
          >
            이전
          </button>
          <button
            onClick={onNext}
            disabled={!isValid}
            className={`
            flex-1 py-[19px] text-sm font-bold rounded-lg
            ${isValid ? "bg-blue-60 text-white" : "bg-coolNeutral-95 text-coolNeutral-30"}
          `}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
