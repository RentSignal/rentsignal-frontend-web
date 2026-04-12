import React, { useState } from "react";
import { useDraggable, useDroppable, DragDropProvider } from "@dnd-kit/react";
import CloseIcon from "@/assets/icons/close_icon.svg?react";

function DraggableItem({ id }: { id: string }) {
  const { ref, handleRef } = useDraggable({ id });

  return (
    <div ref={ref} className="py-2 text-center bg-white border rounded-lg">
      <button ref={handleRef} className="cursor-grab">
        {id}
      </button>
    </div>
  );
}

function DroppableSlot({
  id,
  value,
  onRemove,
}: {
  id: string;
  value?: string;
  onRemove?: (id: string) => void;
}) {
  const { ref, isDropTarget } = useDroppable({ id });

  return (
    <div
      ref={ref}
      className={`
    flex items-center justify-between pt-2 pb-2 gap-[34px]
    transition-colors
    ${isDropTarget ? "text-white bg-blue-95 rounded-lg" : ""}
  `}
    >
      {/* 왼쪽 묶음 */}
      <div className="flex items-center gap-[34px]">
        <div
          className={`w-[25px] h-[25px] rounded-full flex items-center justify-center text-sm
        ${
          isDropTarget
            ? "text-white bg-blue-80"
            : value
              ? "font-medium bg-blue-80 text-white"
              : "text-gray-400 bg-coolNeutral-95"
        }
        ${isDropTarget || value ? "shadow-[inset_0_0_0_2px_#3B82F6]" : ""}
      `}
        >
          {id}
        </div>

        <p
          className={`text-sm ${
            value ? "text-blue-60 font-medium" : "text-gray-400"
          }`}
        >
          {value ?? "여기에 드래그 앤 드롭"}
        </p>
      </div>

      {/* 오른쪽 버튼 */}
      {value && (
        <button
          onClick={() => onRemove?.(id)}
          className="p-1 transition rounded hover:bg-gray-200"
        >
          <CloseIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
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
  onSubmit: () => void;
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
  const isValid = value.length > 0;

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;

        const targetId = Number(event.operation.target?.id);
        const sourceId = String(event.operation.source?.id);

        if (event.operation.target == null || event.operation.source == null)
          return;
        setPriority((prev) => {
          const updated = { ...prev };

          Object.keys(updated).forEach((key) => {
            if (updated[Number(key)] === sourceId) {
              delete updated[Number(key)];
            }
          });

          updated[Number(targetId)] = sourceId;

          return updated;
        });
      }}
    >
      <div className="pt-[17px] px-5 flex flex-col gap-6">
        <div>
          <h2 className="text-base font-semibold">Step 3</h2>
          <p className="text-sm font-medium text-coolNeutral-30">
            우선순위로 둘 생활요소를 선택하세요.
          </p>

          <div className="flex gap-[5px] mt-3">
            {preferOption.map((item) => {
              const selected = value.includes(item);

              return (
                <button
                  key={item}
                  onClick={() => onChange(item)}
                  className={`
                  flex-1 px-3 py-2 border rounded-lg
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
          {value === "편의시설" && (
            <div className="pt-[48px] mt-3">
              <p className="text-sm font-medium text-coolNeutral-25 mb-[26px]">
                드래그하여 우선순위를 정해주세요.
              </p>
              <div className="mt-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <DroppableSlot
                    key={num}
                    id={String(num)}
                    value={priority[num]}
                    onRemove={(id) => {
                      setPriority((prev) => {
                        const updated = { ...prev };
                        delete updated[Number(id)];
                        return updated;
                      });
                    }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {facilityOption.map((item) => (
                  <DraggableItem key={item} id={item} />
                ))}
              </div>
            </div>
          )}
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
    </DragDropProvider>
  );
}
