import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Map from '../components/Map';
import PanelHeader from '@/components/Panel/PanelHeader';

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* 60px Sidebar */}
      <div className="relative z-50">
        <Sidebar />
      </div>

      {/* Map, Overlay 영역 */}
      <div className="relative flex-1">

        {/* 지도 */}
        <Map />

        {/* 패널 */}
        <div
            className={`
              absolute left-0 top-0 h-full w-[377px]
              bg-white border-r border-divider_grey
              z-40
              transition-transform duration-300 ease-in-out
              ${isOpen ? 'translate-x-0' : 'translate-x-[-315px]'}
            `}
          >
          {/* 헤더 */}
          <PanelHeader onToggle={() => setIsOpen(prev => !prev)} />
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default MainLayout;