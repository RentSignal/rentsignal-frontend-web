type InfoSectionToggleType = "INFO" | "LIFESTYLE";
type Props = {
  value: InfoSectionToggleType;
  onChange: (value: InfoSectionToggleType) => void;
};

export default function InfoSectionToggle({ value, onChange }: Props) {
  return (
    <div className="flex pl-5 gap-[12px] mb-2 sticky top-0 bg-white z-20 ">
      <button
        onClick={() => onChange("INFO")}
        className={`text-lg font-semibold transition-colors pb-1 ${
          value === "INFO"
            ? "text-blue-60 border-b-2 border-blue-60"
            : "text-toggle_grey border-b-2 border-transparent"
        }`}
      >
        지수 중심
      </button>

      <button
        onClick={() => onChange("LIFESTYLE")}
        className={`text-lg font-semibold transition-colors pb-1 ${
          value === "LIFESTYLE"
            ? "text-blue-60 border-b-2 border-blue-60"
            : "text-toggle_grey border-b-2 border-transparent"
        }`}
      >
        생활요소 중심
      </button>
    </div>
  );
}
