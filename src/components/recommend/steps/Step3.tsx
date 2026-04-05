export default function Step3({
  value,
  onChange,
  onPrev,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  onPrev: () => void;
  onSubmit: () => void;
}) {
  const preferOption = ["가성비", "편의시설"];
  const isValid = value.length > 0;

  return (
    <div className="pt-[17px] px-5 flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold">Step 3</h2>
        <p className="text-sm text-gray-500">
          우선순위로 둘 생활요소를 선택하세요.
        </p>

        <div className="flex gap-2 mt-3">
          {preferOption.map((item) => {
            const selected = value.includes(item);

            return (
              <button
                key={item}
                onClick={() => onChange(item)}
                className={`
                  px-3 py-2 border rounded-lg
                  ${
                    selected
                      ? "bg-blue-60 text-white border-blue-60"
                      : "border-gray-300"
                  }
                `}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-1">
        <button
          onClick={onPrev}
          className="px-[27px] py-1 rounded-lg text-sm font-bold bg-blue-80 text-white"
        >
          이전
        </button>

        <button
          onClick={onSubmit}
          disabled={!isValid}
          className={`
            px-[27px] py-1 rounded-lg text-sm font-bold
            ${isValid ? "bg-blue-60 text-white" : "bg-gray-300 text-gray-500"}
          `}
        >
          완료
        </button>
      </div>
    </div>
  );
}
