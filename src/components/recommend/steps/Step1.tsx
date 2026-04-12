import SearchIcon from "@/assets/icons/search_icon.svg?react";
import CloseIcon from "@/assets/icons/close_icon.svg?react";
import regions from "@/data/regions.json";
import { useState, useEffect } from "react";

export default function Step1({
  value,
  onChange,
  onNext,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  const [debounced, setDebounced] = useState("");
  const [list, setList] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(false); //검색 드롭타인 메뉴에서 선택되었는지

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, 200);

    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    const keyword = debounced.trim();

    if (keyword.length < 1) {
      setList([]);
      return;
    }

    const filtered = regions
      .filter((region) => region.includes(keyword))
      .slice(0, 10);

    setList(filtered);
  }, [debounced]);

  return (
    <div className="pt-[17px] px-5">
      {/* Step 1 헤더 */}
      <div className="flex flex-col gap-[6px] mb-5">
        <h2 className="text-base font-semibold text-coolNeutral-20">Step 1</h2>
        <p className="text-sm font-medium text-coolNeutral-25 ">
          아래 검색창을 통해 위치를 선택해주세요.
        </p>
      </div>
      <div className="flex flex-col gap-[207px]">
        <div className="relative">
          <span className="absolute -translate-y-1/2 left-3 top-1/2">
            <SearchIcon />
          </span>
          <input
            className={`
                      px-10 py-[10px]
                      border rounded-[10px]
                      outline-none
                      bg-blue-99
                      text-[12px] font-medium
                      w-full

                      ${
                        isSelected
                          ? "border-blue-500 text-blue-500"
                          : "border-blue-90 text-coolNeutral-50"
                      }
                    `}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setOpen(true);
              setIsSelected(false);
            }}
            placeholder="거주하고자 하는 희망 지역을 검색해 주세요. (ex: 명동)"
          />
          <span className="absolute -translate-y-1/2 right-3 top-1/2">
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                  setIsSelected(false);
                }}
                className="flex items-center justify-center"
              >
                <CloseIcon className="w-4 h-4 text-coolNeutral-40 hover:text-coolNeutral-20" />
              </button>
            )}
          </span>
          {open && list.length > 0 && (
            <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden bg-white border rounded-lg shadow-md top-full border-coolNeutral-95">
              {list.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="block w-full px-3 py-2 gap-[6px]
                             text-[12px] font-medium text-left text-coolNeutral-30
                             hover:text-blue-60"
                  onMouseDown={() => {
                    onChange(item);
                    setOpen(false);
                    setIsSelected(true);
                  }}
                >
                  {item}
                </button>
              ))}
              {open && debounced.trim().length >= 2 && list.length === 0 && (
                <div
                  className="absolute left-0 right-0 top-full mt-2 z-20
                             rounded-[10px] border border-coolNeutral-90
                bg-white px-3 py-2 text-[12px] text-coolNeutral-50 shadow-md"
                >
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          )}
        </div>
        <button
          onClick={onNext}
          className="self-end px-[47px] py-[10px] text-sm font-bold
             text-white rounded-lg bg-coolNeutral-70"
        >
          다음
        </button>
      </div>
    </div>
  );
}
