import Step1 from "@/components/recommend/steps/Step1";
import Step2 from "@/components/recommend/steps/Step2";
import Step3 from "@/components/recommend/steps/Step3";
import type { RecommendFormData } from "@/types/recommend";
import { fetchHousingRecommendations } from "@/services/recommendApi";
import { useOutletContext } from "react-router-dom";

type StepContentProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  formData: RecommendFormData;
  setFormData: React.Dispatch<React.SetStateAction<RecommendFormData>>;
};

type LayoutContext = {
  openResultPanel: () => void;
  setRecommendResult: (data: any) => void;
};

export default function StepContent({
  step,
  setStep,
  formData,
  setFormData,
}: StepContentProps) {
  const { openResultPanel, setRecommendResult } =
    useOutletContext<LayoutContext>();

  switch (step) {
    case 1:
      return (
        <Step1
          value={formData.userDong}
          onChange={(v) => setFormData((prev) => ({ ...prev, userDong: v }))}
          onNext={() => {
            if (!formData.userDong) return;
            setStep(2);
          }}
        />
      );

    case 2:
      return (
        <Step2
          value={{
            houseType: formData.houseType,
            rentType: formData.rentType,
          }}
          onChange={(v) =>
            setFormData((prev) => ({
              ...prev,
              houseType: v.houseType,
              rentType: v.rentType,
            }))
          }
          onPrev={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      );

    case 3:
      return (
        <Step3
          value={formData.sortBy}
          onChange={(v) => setFormData((prev) => ({ ...prev, sortBy: v }))}
          onPrev={() => setStep(2)}
          onSubmit={async (priority) => {
            try {
              let payload = { ...formData };

              if (formData.sortBy === "편의시설") {
                const facilityPriorities = Object.entries(priority)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([, value]) => value);

                payload = {
                  ...payload,
                  facilityPriorities,
                };
              }

              const res = await fetchHousingRecommendations(payload);

              console.log(payload);

              if (res.success) {
                setRecommendResult(res.data);
                openResultPanel();
                console.log("추천 조회 성공");
                console.log(res.data);
              }
            } catch (e) {
              console.error("추천 조회 실패", e);
            }
          }}
        />
      );

    default:
      return null;
  }
}
