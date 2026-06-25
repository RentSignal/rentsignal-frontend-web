import { useEffect, useState } from "react";
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
  const isCommunity = location.pathname.startsWith("/community");
  const isRecommend = location.pathname.startsWith("/recommend");

  // 로고 헤더 숨길 경로들
  const noHeaderPaths = [
    "/profile/name",
    "/profile/phone",
    "/profile/delete",
    "/profile/posts",
    "/profile/comments",
    "/profile/likes",
  ];

  const hideHeader = noHeaderPaths.includes(location.pathname);

  const [isOpen, setIsOpen] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [recommendResultOpen, setRecommendResultOpen] = useState(false);
  const [recommendResult, setRecommendResult] = useState<any>(null);

  useEffect(() => {
    if (!isRecommend) {
      setRecommendResultOpen(false);
      setRecommendResult(null);
    }
  }, [isRecommend]);

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
            absolute left-0 top-0 h-full ${isCommunity ? "w-fit" : "w-[377px]"}
            bg-white border-r border-divider_grey
            z-40
            transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "translate-x-[-315px]"}
          `}
        >
          {/* 헤더 */}
          {!isCommunity && !hideHeader && (
            <PanelHeader onToggle={() => setIsOpen((prev) => !prev)} />
          )}

          <Outlet
            context={{
              openLoginModal: () => setLoginOpen(true),
              openPhoneModal: () => setPhoneOpen(true),
              openResultPanel: () => setRecommendResultOpen(true),
              setRecommendResult,
              onToggle: () => setIsOpen((prev) => !prev),
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
