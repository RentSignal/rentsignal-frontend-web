import { useState } from "react";
import { useDragScroll } from "@/hooks/useDragScroll";
import PopOverIcon from "@/assets/icons/popover_icon.svg?react";
import PopOverBlue from "@/assets/icons/popover_icon_blue.svg?react";
import PopOverClose from "@/assets/icons/popover_close.svg?react";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

type CategoryItem = {
  id: string;
  label: string;
  showPopover?: boolean;
  title?: string;
  description?: string;
};

type CategoryToggleProps = {
  items: CategoryItem[];
  value: string;
  onChange: (value: string) => void;
};

const CategoryToggle = ({ items, value, onChange }: CategoryToggleProps) => {
  const { ref, isDragging, onMouseDown, shouldBlockClick } =
    useDragScroll<HTMLDivElement>();

  const onClickItem = (itemId: string) => {
    if (shouldBlockClick()) return;
    onChange(itemId);
  };
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div
      ref={ref}
      onMouseDownCapture={onMouseDown}
      className={`
        flex flex-nowrap items-center
        gap-[7px] pr-4
        overflow-x-auto no-scrollbar
        select-none
        ${isDragging ? "cursor-grabbing" : "cursor-grab"}
      `}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="relative flex items-start mt-2 shrink-0 group"
        >
          <button
            draggable={false}
            onClick={() => onClickItem(item.id)}
            className={`
            whitespace-nowrap
            px-[6px] py-[4px]
            rounded-lg
            text-[14px] font-normal
            transition-all
        ${
          value === item.id
            ? "bg-coolNeutral-30 text-white border-[1.5px] border-coolNeutral-30"
            : "text-coolNeutral-70 border-[1.5px] border-coolNeutral-90"
        }
      `}
          >
            {item.label}
          </button>

          {item.showPopover && (
            <Popover
              open={openId === item.id}
              onOpenChange={(open) => {
                setOpenId(open ? item.id : null);
              }}
            >
              <PopoverTrigger asChild>
                <button className="absolute -top-1 -right-1.5 bg-white rounded-[21px] shadow-sm">
                  {openId === item.id ? (
                    <PopOverBlue className="w-[13px] h-[13px]" />
                  ) : (
                    <PopOverIcon className="w-[13px] h-[13px]" />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={30}
                alignOffset={-100}
                className="px-[18px] pt-[18px] pb-[29px] bg-white 
                shadow-[0_2px_8px_0_rgba(0,0,0,0.12),0_1px_4px_0_rgba(0,0,0,0.08),0_0_1px_0_rgba(0,0,0,0.08)] 
                outline-none w-72 rounded-[21px] ring-0"
              >
                <button
                  onClick={() => setOpenId(null)}
                  className="absolute top-5 right-4"
                >
                  <PopOverClose className="w-3 h-3 text-coolNeutral-50" />
                </button>
                <PopoverHeader>
                  <PopoverTitle className="pb-[43px] text-[16px] text-coolNeutral-10">
                    {item.title}
                  </PopoverTitle>
                  <PopoverDescription className="text-coolNeutral-25">
                    {item.description}
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryToggle;
