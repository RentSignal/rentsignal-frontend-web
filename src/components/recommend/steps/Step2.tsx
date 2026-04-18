import officetelOff from "@/assets/icons/officetel_disabled_icon.svg";
import officetelOn from "@/assets/icons/officetel_enabled_icon.svg";
import oneroomOff from "@/assets/icons/oneroom_disabled_icon.svg";
import oneroomOn from "@/assets/icons/oneroom_enabled_icon.svg";

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
  const housingOption = [
    {
      label: "오피스텔",
      value: "오피스텔",
      icon: officetelOff,
      enabledIcon: officetelOn,
    },
    {
      label: "원룸",
      value: "원룸",
      icon: oneroomOff,
      enabledIcon: oneroomOn,
    },
  ];
  const rentOption = ["월세", "전세"];

  const isValid = value.houseType && value.rentType;
  // TODO: 동적 배열에 우선순위 5가지 validation check 부분 추가

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
        <div className="flex gap-[10px] mt-4">
          {housingOption.map((item) => {
            const isSelected = value.houseType === item.value;
            return (
              <button
                key={item.value}
                onClick={() => handleSelect("houseType", item.value)}
                className={`
                pt-[8px] flex-1 flex flex-col items-center justify-start
                h-[82px] relative
                rounded-[11px] border transition
                ${isSelected ? "border-blue-60 bg-white" : "border-coolNeutral-90  bg-white"}
              `}
              >
                {/* 텍스트 */}
                <span
                  className={`text-base font-medium 
                              ${isSelected ? "text-blue-60" : " text-coolNeutral-30 "}`}
                >
                  {item.label}
                </span>

                {/* 이미지 */}
                <img
                  src={isSelected ? item.enabledIcon : item.icon}
                  alt={item.label}
                  className="absolute bottom-[-2px]"
                />
              </button>
            );
          })}
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
            className="w-[99px] py-[19px] text-[17px] font-semibold rounded-lg
                     bg-white text-coolNeutral-50 border border-b border-coolNeutral-95"
          >
            이전
          </button>
          <button
            onClick={onNext}
            disabled={!isValid}
            className={`
            flex-1 py-[19px] text-[17px] font-semibold rounded-lg
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
