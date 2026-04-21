type StepperProps = {
  currentStep: number;
};

const steps = ["거주지역", "거주형태", "우선순위"];
const RADIUS = 17.5;

export default function Stepper({ currentStep }: StepperProps) {
  const progress = (currentStep - 1) / (steps.length - 1);

  return (
    <div className="relative w-full mt-[21px]">
      {/* 배경 선 */}
      <div
        className="absolute top-[13px] left-0 right-0 h-[5px] bg-coolNeutral-95"
        style={{
          left: `${RADIUS}px`,
          right: `${RADIUS}px`,
        }}
      />

      {/* 진행 선 */}
      <div
        className="absolute top-[13px] h-[5px] bg-blue-60 transition-all"
        style={{
          left: `${RADIUS}px`,
          width: `calc(${progress} * (100% - ${RADIUS * 2}px))`,
        }}
      />

      {/* step */}
      <div className="relative flex justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;

          return (
            <div key={label} className="flex flex-col items-center gap-1">
              {/* 원 */}
              <div
                className={`
                  w-[35px] h-[35px] rounded-full flex items-center justify-center text-[12px]
                  ${
                    isActive
                      ? "bg-blue-70 text-white font-semibold text-sm shadow-[inset_0_0_0_3px_#3B82F6]"
                      : "bg-coolNeutral-97 text-coolNeutral-90 font-semibold text-sm shadow-[inset_0_0_0_3px_#E2E3E4]"
                  }
                `}
              >
                {stepNumber}
              </div>

              {/* 라벨 */}
              <p
                className={`
                  text-sm font-semibold 
                  ${isActive ? "text-coolNeutral-30" : "text-coolNeutral-90"}
                `}
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
