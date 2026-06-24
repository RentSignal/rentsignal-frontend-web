import type { IconButtonProps } from "@/types/home";

const IconButton = ({
  icon,
  label,
  iconWidth,
  iconHeight,
  onClick,
}: IconButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col items-center"
  >
    <div className="relative w-[54px] h-[52px] bg-blue-95 border border-blue-99 rounded-[14px] mb-[10px]">
      <img
        src={icon}
        alt={label}
        className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
        style={{ width: `${iconWidth}px`, height: `${iconHeight}px` }}
      />
    </div>
    <h4 className="w-[76px] whitespace-normal break-keep text-center text-xs font-semibold leading-[16px]">
      {label}
    </h4>
  </button>
);

export default IconButton;
