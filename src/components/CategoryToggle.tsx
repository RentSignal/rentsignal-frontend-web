import { useDragScroll } from "@/hooks/useDragScroll";

type CategoryToggleProps = {
  items: string[];
  value: string;
  onChange: (value: string) => void;
};

const CategoryToggle = ({ items, value, onChange }: CategoryToggleProps) => {
  const { ref, isDragging, onMouseDown, shouldBlockClick } =
    useDragScroll<HTMLDivElement>();

  const onClickItem = (item: string) => {
    if (shouldBlockClick()) return; 
    onChange(item);
  };

  return (
    <div
      ref={ref}
      onMouseDownCapture={onMouseDown}
      className={`
        flex 
        flex-nowrap items-center 
        gap-2 pr-4
        overflow-x-auto no-scrollbar
        select-none
        ${isDragging ? "cursor-grabbing" : "cursor-grab"}
      `}
    >
      {items.map((item) => (
        <button
          key={item}
          draggable={false}
          onClick={() => onClickItem(item)}
          className={`
            shrink-0 whitespace-nowrap 
            px-3 py-1 
            rounded-md 
            text-sm font-medium 3
            transition-all
            ${value === item
              ? "bg-blue-90 text-coolNeutral-10 border border-blue-90"
              : "text-[#626363] border border-gray-300"}
          `}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default CategoryToggle;