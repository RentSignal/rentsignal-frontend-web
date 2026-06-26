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
    <div className="flex flex-col min-h-screen px-6">
      {/* Step 1 헤더 */}
      <div className="flex flex-col gap-[6px] pt-[16px] pb-[10px]">
        <h2 className="text-[22px] font-semibold text-coolNeutral-25">
          Step 1
        </h2>
        <p className="text-lg font-medium text-coolNeutral-25 ">
          아래 검색창을 통해 위치를 선택해주세요.
        </p>
      </div>
      <div className="flex flex-col flex-1">
        <div className="relative">
          {/* 검색영역 */}
          <span className="absolute -translate-y-1/2 left-3 top-1/2">
            <SearchIcon />
          </span>
          <input
            className={`
                      px-10 py-[10px]
                      border rounded-[10px]
                      outline-none
                      bg-blue-99
                      text-[14px] font-normal text-coolNeutral-30
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
            placeholder="거주하고자 하는 지역을 검색해 주세요."
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
            <div className="absolute left-0 right-0 z-20 mt-3 overflow-hidden bg-white border rounded-lg top-full border-coolNeutral-95">
              {list.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="block w-full px-4 py-[10px] gap-[14px]
                             text-[14px] font-semibold text-left text-coolNeutral-30
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
        <div className="fixed bottom-0 left-0 right-0 px-5 py-[24px] bg-white">
          <button
            disabled={!isSelected}
            onClick={onNext}
            className={`w-full h-[51px] text-[17px] font-semibold rounded-lg 
              ${isSelected ? "text-white bg-blue-60 " : " text-coolNeutral-50 bg-coolNeutral-97"}`}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
