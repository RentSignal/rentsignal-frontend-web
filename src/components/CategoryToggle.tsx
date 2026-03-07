import { useDragScroll } from "@/hooks/useDragScroll";
import PopOverIcon from "@/assets/icons/popover_icon.svg?react";
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

  return (
    <div
      ref={ref}
      onMouseDownCapture={onMouseDown}
      className={`
        flex flex-nowrap items-center
        gap-2 pr-4
        overflow-x-auto no-scrollbar
        select-none
        ${isDragging ? "cursor-grabbing" : "cursor-grab"}
      `}
    >
      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-1 shrink-0">
          <button
            draggable={false}
            onClick={() => onClickItem(item.id)}
            className={`
        whitespace-nowrap
        px-3 py-1
        rounded-md
        text-sm font-medium
        transition-all
        ${
          value === item.id
            ? "bg-blue-90 text-coolNeutral-10 border border-blue-90"
            : "text-[#626363] border border-gray-300"
        }
      `}
          >
            {item.label}
          </button>

          {item.showPopover && (
            <Popover>
              <PopoverTrigger asChild>
                <PopOverIcon className="w-3 h-3" />
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="p-4 bg-white shadow-lg outline-none w-72 rounded-xl ring-0"
              >
                <PopoverHeader>
                  <PopoverTitle className="pb-3">{item.title}</PopoverTitle>

                  <PopoverDescription>{item.description}</PopoverDescription>
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
