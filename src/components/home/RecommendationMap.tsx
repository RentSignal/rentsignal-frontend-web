import { useEffect, useRef } from "react";
import type {
  KakaoCustomOverlay,
  KakaoMapsApi,
  RecommendationMapProps,
} from "@/types/home";

const KAKAO_SDK_ID = "kakao-map-sdk";
const getKakaoMaps = () => window.kakao?.maps as KakaoMapsApi | undefined;

const loadKakaoSdk = () =>
  new Promise<void>((resolve) => {
    const maps = getKakaoMaps();

    if (maps) {
      maps.load(resolve);
      return;
    }

    const existingScript = document.getElementById(KAKAO_SDK_ID);

    if (existingScript) {
      const intervalId = window.setInterval(() => {
        const loadedMaps = getKakaoMaps();

        if (!loadedMaps) return;

        window.clearInterval(intervalId);
        loadedMaps.load(resolve);
      }, 50);
      return;
    }

    const script = document.createElement("script");
    script.id = KAKAO_SDK_ID;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_JS_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      const loadedMaps = getKakaoMaps();

      if (!loadedMaps) {
        resolve();
        return;
      }

      loadedMaps.load(resolve);
    };
    document.head.appendChild(script);
  });

const RecommendationMap = ({
  latitude,
  longitude,
}: RecommendationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let overlay: KakaoCustomOverlay | null = null;
    let isMounted = true;

    const initMap = async () => {
      await loadKakaoSdk();
      const maps = getKakaoMaps();

      if (!isMounted || !mapRef.current || !maps) return;

      const center = new maps.LatLng(latitude, longitude);
      const map = new maps.Map(mapRef.current, {
        center,
        level: 5,
      });

      map.setDraggable(false);
      map.setZoomable(false);

      const markerElement = document.createElement("div");
      markerElement.className =
        "h-[12px] w-[12px] rounded-full border-[2px] border-white bg-blue-60 ";

      const customOverlay = new maps.CustomOverlay({
        position: center,
        content: markerElement,
        yAnchor: 0.5,
        xAnchor: 0.5,
      });
      customOverlay.setMap(map);
      overlay = customOverlay;
    };

    initMap();

    return () => {
      isMounted = false;
      overlay?.setMap(null);
    };
  }, [latitude, longitude]);

  return <div ref={mapRef} className="h-[52px] w-full bg-slate-100" />;
};

export default RecommendationMap;
