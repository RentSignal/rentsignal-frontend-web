import type { HousingType } from "@/services/infoApi";

interface ResidenceTypeToggleProps {
  value: HousingType;
  onChange: (value: HousingType) => void;
}

const ResidenceTypeToggle = ({ value, onChange }: ResidenceTypeToggleProps) => {
  const items = [
    { id: "APARTMENT" as const, label: "아파트" },
    { id: "MULTI_FAMILY_HOUSE" as const, label: "연립/다세대" },
  ];

  return (
    <div className="inline-flex items-center bg-coolNeutral-97 border border-coolNeutral-95 rounded-[8px]">
      {items.map((item) => {
        const isSelected = value === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`
              relative px-[12px] py-1 
              font-medium text-[14px] text-sm 
              transition-all duration-200
              rounded-[8px] whitespace-nowrap
              filter drop-shadow-[-1px_0_3px_#E2E3E4]
              ${
                isSelected
                  ? "bg-white text-coolNeutral-10"
                  : "text-coolNeutral-50"
              }
            `}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default ResidenceTypeToggle;
