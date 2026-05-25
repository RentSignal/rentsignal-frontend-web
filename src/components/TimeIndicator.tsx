import { useState } from "react";

export type TimeIndicatorValue =
  | "ONE_YEAR"
  | "SIX_MONTH"
  | "ONE_MONTH"
  | "CURRENT";

type TimeIndicatorProps = {
  disabled?: boolean;
  value?: TimeIndicatorValue;
  onChange?: (value: TimeIndicatorValue) => void;
  disabledValues?: TimeIndicatorValue[];
};

const TimeIndicator = ({
  disabled = false,
  value,
  onChange,
  disabledValues = [],
}: TimeIndicatorProps) => {
  const steps = [
    { label: "1년전", value: "ONE_YEAR" as const },
    { label: "6개월전", value: "SIX_MONTH" as const },
    { label: "1개월전", value: "ONE_MONTH" as const },
    { label: "현재", value: "CURRENT" as const },
  ];

  const [internalValue, setInternalValue] =
    useState<TimeIndicatorValue>("ONE_YEAR");
  const currentValue = value ?? internalValue;

  return (
    <div className={`w-full pr-5 ${disabled ? "opacity-40" : ""}`}>
      <div className="relative flex items-start justify-between">
        <div className="absolute top-[8px] left-3 right-3 h-[8px] bg-coolNeutral-97 -z-10" />

        {steps.map((step, index) => {
          const isActive = step.value === currentValue;
          const isDisabled = disabled || disabledValues.includes(step.value);

          return (
            <div key={index} className="z-10 flex flex-col items-center">
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => {
                  if (isDisabled) return;

                  setInternalValue(step.value);
                  onChange?.(step.value);
                }}
                className={`
                  w-[23px] h-[23px] rounded-full transition-all duration-300
                  ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}
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
