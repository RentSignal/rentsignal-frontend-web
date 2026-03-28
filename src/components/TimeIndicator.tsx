import { useState } from "react";

type TimeIndicatorProps = {
  disabled?: boolean;
};

const TimeIndicator = ({ disabled = false }: TimeIndicatorProps) => {
  const steps = [
    { label: "1년전", value: "1y" },
    { label: "6개월전", value: "6m" },
    { label: "1개월전", value: "1m" },
    { label: "현재", value: "now" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={`w-full pr-5 ${disabled ? "opacity-40" : ""}`}>
      <div className="relative flex items-start justify-between">
        <div className="absolute top-[8px] left-3 right-3 h-[8px] bg-coolNeutral-97 -z-10" />

        {steps.map((step, index) => {
          const isActive = index === activeIndex;

          return (
            <div key={index} className="z-10 flex flex-col items-center">
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (disabled) return;
                  setActiveIndex(index);
                }}
                className={`
                  w-[23px] h-[23px] rounded-full transition-all duration-300
                  ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
                  ${
                    isActive
                      ? "bg-blue-80 ring-[3px] ring-inset ring-blue-60"
                      : "bg-white ring-[3px] ring-inset ring-coolNeutral-97"
                  }
                `}
              />
              <span className="mt-2 text-[13px] font-normal text-coolNeutral-30">
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeIndicator;
