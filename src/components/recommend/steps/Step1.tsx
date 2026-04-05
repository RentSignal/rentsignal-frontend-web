export default function Step1({
  value,
  onChange,
  onNext,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="pt-[17px] px-5">
      {/* Step 1 헤더 */}
      <div className="flex flex-col gap-[6px] mb-5">
        <h2 className="text-base font-semibold text-coolNeutral-20">Step 1</h2>
        <p className="text-sm font-medium text-coolNeutral-25 ">
          아래 검색창을 통해 위치를 선택해주세요.
        </p>
      </div>
      <div className="flex flex-col gap-[17px]">
        <input
          className="px-2 py-1 rounded-sm border-coolNeutral-50"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="지역 검색"
        />
        <button
          onClick={onNext}
          className="self-end px-[27px] py-1 text-sm font-bold text-white rounded-lg bg-blue-60"
        >
          다음
        </button>
      </div>
    </div>
  );
}
