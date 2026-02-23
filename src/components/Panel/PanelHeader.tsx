import RentSignalIcon from '@/assets/icons/rentsignal.svg?react';
import MenuIcon from '@/assets/icons/menu.svg?react';

interface PanelHeaderProps {
  onToggle: () => void;
}

const PanelHeader = ({ onToggle }: PanelHeaderProps) => {
  return (
    <div className="flex px-5 pt-3 items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <RentSignalIcon className="w-6 h-6" />
        <p className="font-suite font-bold text-lg">
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