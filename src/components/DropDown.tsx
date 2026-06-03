import * as Select from "@radix-ui/react-select";
import ChevronDownIcon from "@/assets/icons/chevron_down.svg?react";

type SelectItem = {
  value: string;
  label: string;
};

type DropDownSize = "sm" | "lg";

interface DropDownProps {
  items: SelectItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: DropDownSize;
  width?: string; // Tailwind width class
  triggerClassName?: string;
}

const dropDownSizeClass: Record<
  DropDownSize,
  { trigger: string; content: string; item: string }
> = {
  sm: {
    trigger: "px-[11px] py-[7px] rounded-[8px] text-sm",
    content: "rounded-lg",
    item: "px-4 py-[10px] text-[14px]",
  },
  lg: {
    trigger: "h-[55px] px-4 py-[17px] rounded-[10px] text-base",
    content: "rounded-[10px]",
    item: "px-4 py-[10px] text-[14px]",
  },
};

const DropDown = ({
  items,
  value,
  onChange,
  placeholder = "선택",
  size = "sm",
  width = "",
  triggerClassName = "",
}: DropDownProps) => {
  const sizeClass = dropDownSizeClass[size];

  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger
        className={`
          inline-flex items-center justify-between 
          gap-2
          border border-coolNeutral-95
          bg-white
          text-coolNeutral-25
          ${sizeClass.trigger}
          ${width}
          ${triggerClassName}
        `}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className={`z-[100] min-w-[var(--radix-select-trigger-width)] overflow-hidden bg-white border border-gray-200 shadow-md ${sizeClass.content}`}
        >
          <Select.Viewport>
            {items.map((item) => (
              <Select.Item
                key={item.value}
                value={item.value}
                className={`block w-full gap-[14px] text-left font-semibold text-coolNeutral-30 cursor-pointer hover:text-blue-60 ${sizeClass.item}`}
              >
                <Select.ItemText>{item.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default DropDown;
