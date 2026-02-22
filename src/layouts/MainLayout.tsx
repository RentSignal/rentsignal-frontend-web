import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Map from '../components/Map';
import RentSignalIcon from '@/assets/icons/rentsignal.svg?react';
import MenuIcon from '@/assets/icons/menu.svg?react'; // 경로는 맞게 수정

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
              bg-white p-5 border-r border-divider_grey
              z-40
              transition-transform duration-300 ease-in-out
              ${isOpen ? 'translate-x-0' : 'translate-x-[-315px]'}
            `}
          >
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <RentSignalIcon className="w-6 h-6" />
              <p className="font-suite font-bold text-lg">
                RentSignal
              </p>
            </div>

            <button onClick={() => setIsOpen(prev => !prev)}>
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>

          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default MainLayout;