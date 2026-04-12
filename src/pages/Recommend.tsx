import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useUserStore } from "@/store/userStore";

import Stepper from "@/components/recommend/Stepper";
import StepContent from "@/components/recommend/StepContent";

import type { RecommendFormData } from "@/types/recommend";

type LayoutContext = {
  openLoginModal: () => void;
  openPhoneModal: () => void;
};

const Recommend = () => {
  const { openLoginModal, openPhoneModal } = useOutletContext<LayoutContext>();

  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((s) => s.fetchUser);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RecommendFormData>({
    userDong: "",
    houseType: "",
    rentType: "",
    sortBy: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        await fetchUser();
      } catch {
        openLoginModal();
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!user) return;

    if (user.role === "ROLE_GUEST") {
      openPhoneModal();
    }
  }, [user]);

  if (!user) return null;
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
