import * as Select from "@radix-ui/react-select";
import ChevronDownIcon from "@/assets/icons/chevron_down.svg?react";

type SelectItem = {
  value: string;
  label: string;
};

interface DropDownProps {
  items: SelectItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string; // Tailwind width class
}

const DropDown = ({
  items,
  value,
  onChange,
  placeholder = "선택",
  width = "",
}: DropDownProps) => {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger
        className={`
          inline-flex items-center justify-between
          gap-2
          px-[11px] py-[7px]
          rounded-[8px]
          border border-coolNeutral-95
          bg-white
          text-sm text-coolNeutral-30
          ${width}
        `}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-md">
          <Select.Viewport>
            {items.map((item) => (
              <Select.Item
                key={item.value}
                value={item.value}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
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
