import { useEffect, useRef, useState } from "react";
import seoulGeoJson from "@/assets/geojson/seoul-gu.json";

declare global {
  interface Window {
    kakao: any;
  }
}

const KAKAO_SDK_ID = "kakao-map-sdk";

const POLYGON_STYLE = {
  strokeWeight: 2,
  strokeColor: "#004c80",
  strokeOpacity: 0.5,
  fillColor: "#C4ECFE",
  fillOpacity: 0.3,
};

const mouseoverOption = {
  fillColor: "#00AEFF",
  fillOpacity: 0.5,
};

const mouseoutOption = {
  fillColor: "#C4ECFE",
  fillOpacity: 0.3,
};

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapRefInstance = useRef<any>(null);
  const overlayRef = useRef<any>(null);
  const [mapType, setMapType] = useState<"roadmap" | "skyview">("roadmap");

  /* ------------------------- SDK Load ------------------------- */

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

  /* ------------------------- Map Init ------------------------- */

  const initMap = () => {
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

    drawGeoJSON(map);
    setCurrentLocation(map);
  };

  /* ------------------------- GeoJSON ------------------------- */

  const drawGeoJSON = (map: any) => {
    seoulGeoJson.features.forEach((feature: any) => {
      const { geometry, properties } = feature;

      if (geometry.type === "Polygon") {
        createPolygon(map, geometry.coordinates, properties);
      }

      if (geometry.type === "MultiPolygon") {
        geometry.coordinates.forEach((coords: any) => {
          createPolygon(map, coords, properties);
        });
      }
    });
  };

  const createPolygon = (map: any, rings: number[][][], properties: any) => {
    const paths = rings.map((ring) =>
      ring.map(([lng, lat]) => new window.kakao.maps.LatLng(lat, lng)),
    );

    const polygon = new window.kakao.maps.Polygon({
      map,
      path: paths,
      ...POLYGON_STYLE,
    });

    window.kakao.maps.event.addListener(
      polygon,
      "mouseover",
      (mouseEvent: any) => {
        polygon.setOptions(mouseoverOption);

        if (!overlayRef.current) return;

        overlayRef.current.setContent(`
          <div style="
            padding:6px 10px;
            background:white;
            border-radius:6px;
            font-size:12px;
            box-shadow:0 2px 6px rgba(0,0,0,0.2);
          ">
            ${properties.SIG_KOR_NM}
          </div>
        `);

        overlayRef.current.setPosition(mouseEvent.latLng);
        overlayRef.current.setMap(map);
      },
    );

    window.kakao.maps.event.addListener(polygon, "mouseout", () => {
      polygon.setOptions(mouseoutOption);

      if (overlayRef.current) {
        overlayRef.current.setMap(null);
      }
    });
  };

  /* ------------------------- Current Location ------------------------- */

  const setCurrentLocation = (map: any) => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      const loc = new window.kakao.maps.LatLng(latitude, longitude);

      map.setCenter(loc);

      new window.kakao.maps.Marker({
        position: loc,
        map,
      });
    });
  };

  /* ------------------------- Effect ------------------------- */

  useEffect(() => {
    loadKakaoSdk().then(() => {
      initMap();
    });
  }, []);

  useEffect(() => {
    if (!mapRefInstance.current) return;

    mapRefInstance.current.setMapTypeId(
      mapType === "roadmap"
        ? window.kakao.maps.MapTypeId.ROADMAP
        : window.kakao.maps.MapTypeId.HYBRID,
    );
  }, [mapType]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />

      <div className="absolute z-10 flex top-4 right-4">
        <button
          onClick={() => setMapType("roadmap")}
          className={`px-3 py-1 rounded ${
            mapType === "roadmap"
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-gray-700"
          }`}
        >
          지도
        </button>

        <button
          onClick={() => setMapType("skyview")}
          className={`px-3 py-1 rounded ${
            mapType === "skyview"
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-gray-700"
          }`}
        >
          스카이뷰
        </button>
      </div>
    </div>
  );
};

export default Map;
