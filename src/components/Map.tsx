import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

let isScriptLoaded = false;   

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    // 이미 SDK 로드된 경우
    if (window.kakao && window.kakao.maps) {
      initMap();
      return;
    }

    if (isScriptLoaded) return;

    isScriptLoaded = true;

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_JS_KEY}&autoload=false`;
    script.async = true;

    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        initMap();
      });
    };

    function initMap() {
      if (!mapRef.current) return;

      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 5,
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const loc = new window.kakao.maps.LatLng(lat, lng);

          map.setCenter(loc);

          const marker = new window.kakao.maps.Marker({
            position: loc,
          });

          marker.setMap(map);
        });
      }
    }
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
          width: '100%',
          height: '100%', 
      }}
    />
  );
};

export default Map;
