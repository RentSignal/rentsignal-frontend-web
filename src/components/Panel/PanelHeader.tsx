import RentSignalIcon from "@/assets/icons/rentsignal.svg?react";
import MenuIcon from "@/assets/icons/menu.svg?react";

interface PanelHeaderProps {
  onToggle: () => void;
}

const PanelHeader = ({ onToggle }: PanelHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-[24px] py-[11px]">
      <div className="flex items-center gap-[11px]">
        <RentSignalIcon />
        <p className="text-[17px] font-bold font-suite text-coolNeutral-10">
          RentSignal
        </p>
      </div>
      <button onClick={onToggle}>
        <MenuIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PanelHeader;
