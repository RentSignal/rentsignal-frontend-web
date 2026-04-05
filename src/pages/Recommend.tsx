import { useState } from "react";
import Stepper from "@/components/recommend/Stepper";
import StepContent from "@/components/recommend/StepContent";

import type { RecommendFormData } from "@/types/recommend";

const Recommend = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RecommendFormData>({
    userDong: "",
    houseType: "",
    rentType: "",
    sortBy: "",
  });
  return (
    <>
      <div className="px-5">
        <Stepper currentStep={currentStep} />
      </div>
      <StepContent
        step={currentStep}
        setStep={setCurrentStep}
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
};

export default Recommend;
