import { useEffect, useRef, useState } from "react";

const KAKAO_SDK_ID = "kakao-map-sdk";

const loadKakaoSdk = () =>
  new Promise<void>((resolve) => {
    if (window.kakao?.maps) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(
      KAKAO_SDK_ID,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.onload = () => {
        window.kakao.maps.load(() => resolve());
      };
      return;
    }

    const script = document.createElement("script");
    script.id = KAKAO_SDK_ID;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_JS_KEY}&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => resolve());
    };

    document.head.appendChild(script);
  });

export const useKakaoMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapRefInstance = useRef<any>(null);
  const overlayRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    const initMap = async () => {
      await loadKakaoSdk();

      if (!mapRef.current) return;

      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 8,
      });

      mapRefInstance.current = map;

      overlayRef.current = new window.kakao.maps.CustomOverlay({
        zIndex: 2,
        yAnchor: 1,
      });

      setIsMapReady(true);
    };

    initMap();
  }, []);

  return {
    mapRef,
    mapRefInstance,
    overlayRef,
    isMapReady,
  };
};
