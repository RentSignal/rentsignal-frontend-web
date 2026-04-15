import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Map from "@/components/Map";
import PanelHeader from "@/components/Panel/PanelHeader";
import LoginModal from "@/components/LoginModal";
import PhoneModal from "@/components/phoneModal";
import RecommnedationResultPanel from "@/components/recommend/RecommendationResultPanel";

const MainLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [isOpen, setIsOpen] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false); //로그인 모달 상태
  const [phoneOpen, setPhoneOpen] = useState(false); //전화번호 입력 모달 상태
  const [recommendResultOpen, setRecommendResultOpen] = useState(false); //추천 결과 오른쪽 패널 상태관리
  const [recommendResult, setRecommendResult] = useState<any>(null);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 60px Sidebar */}
      <div className="relative z-50">
        <Sidebar />
      </div>

      {/* Map, Overlay 영역 */}
      <div className="relative flex-1">
        {/* 지도 */}
        <Map enableOverlay={isHome} />
        <RecommnedationResultPanel
          open={recommendResultOpen}
          onClose={() => setRecommendResultOpen(false)}
          data={recommendResult}
        />

        {/* 패널 */}
        <div
          className={`
              absolute left-0 top-0 h-full w-[377px]
              bg-white border-r border-divider_grey
              z-40
              transition-transform duration-300 ease-in-out
              ${isOpen ? "translate-x-0" : "translate-x-[-315px]"}
            `}
        >
          {/* 헤더 */}
          <PanelHeader onToggle={() => setIsOpen((prev) => !prev)} />
          <Outlet
            context={{
              openLoginModal: () => setLoginOpen(true),
              openPhoneModal: () => setPhoneOpen(true),
              openResultPanel: () => setRecommendResultOpen(true),
              setRecommendResult,
            }}
          />
        </div>
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
        <PhoneModal open={phoneOpen} onClose={() => setPhoneOpen(false)} />
      </div>
    </div>
  );
};

export default MainLayout;
