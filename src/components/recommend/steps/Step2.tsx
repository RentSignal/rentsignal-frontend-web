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
    <div className="pt-[47px] px-5 flex flex-col gap-6">
      <div>
        <h2 className="mb-[6px] text-base font-semibold text-coolNeutral-20">
          Step 2
        </h2>
        <p className="text-sm font-medium text-coolNeutral-25">
          주거형태를 선택해주세요.
        </p>

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

      <div>
        <p className="text-sm font-medium text-coolNeutral-25">
          계약형태를 선택해주세요.
        </p>

        <div className="flex gap-[5px] mt-2">
          {rentOption.map((item) => (
            <button
              key={item}
              onClick={() => handleSelect("rentType", item)}
              className={`
                flex-1 px-3 py-2 border rounded-lg
                ${
                  value.rentType === item
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

      {/* 다음 버튼 */}
      <div className="flex justify-end gap-1">
        <button
          onClick={onPrev}
          className="px-[47px] py-[10px] text-sm font-bold rounded-lg bg-blue-80 text-white"
        >
          이전
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`
            px-[47px] py-[10px] text-sm font-bold rounded-lg
            ${isValid ? "bg-blue-60 text-white" : "bg-coolNeutral-70 text-white"}
          `}
        >
          다음
        </button>
      </div>
    </div>
  );
}
