import { useEffect, useRef, useState } from "react";
// import seoulGeoJson from "@/assets/geojson/seoul-gu.json";
import seoulGeoJson from "@/assets/geojson/seoul-gu-simple.json";
import { regionMap } from "@/constants/regionMap";
import { useMapOverlayStore } from "@/store/mapOverlayStore";
import {
  clearBasicDistrictPolygons,
  drawBasicDistrictPolygons,
} from "@/components/mapOverlays/basicDistrictOverlay";
import {
  clearConsumerIndexPolygons,
  drawConsumerIndexPolygons,
} from "@/components/mapOverlays/consumerIndexOverlay";
import {
  clearRecommendationDongOverlay,
  drawRecommendationDongOverlay,
} from "@/components/mapOverlays/recommendationDongOverlay";
import {
  clearTransportDongOverlay,
  drawTransportDongOverlay,
} from "@/components/mapOverlays/transportDongOverlay";
import {
  clearConvenienceMarkers,
  drawConvenienceMarkers,
} from "@/components/mapOverlays/convenienceMarkerOverlay";
import {
  clearSubwayLinePolylines,
  clearSubwayStationMarkers,
  drawSubwayLinePolylines,
  drawSubwayStationMarkers,
} from "@/components/mapOverlays/subwayOverlay";
import {
  clearHomeSubwayDistrictOverlay,
  drawHomeSubwayDistrictOverlay,
} from "@/components/mapOverlays/homeSubwayDistrictOverlay";
import {
  clearSafetyIndexOverlays as clearSafetyIndexOverlayRefs,
  clearSelectedSafetyDistrictPolygons as clearSelectedSafetyDistrictPolygonRefs,
  drawSafetyIndexOverlays,
} from "@/components/mapOverlays/safetyOverlay";
import {
  clearRentIndexOverlays as clearRentIndexOverlayRefs,
  clearSelectedRegionPolygons as clearSelectedRegionPolygonRefs,
  drawRentIndexOverlays,
  selectRentIndexItemOnMap,
} from "@/components/mapOverlays/rentIndexOverlay";
import {
  clearSubwayIndexOverlays as clearSubwayIndexOverlayRefs,
  drawSubwayIndexOverlays,
} from "@/components/mapOverlays/subwayIndexOverlay";
import {
  createPolygonPaths,
  getCenterFromLngLatPoints,
  getGeoJsonLngLatPoints,
  type GeoJsonLngLatGeometry,
} from "@/components/mapOverlays/geoJson";
declare global {
  interface Window {
    kakao: any;
  }
}

type Props = {
  enableOverlay?: boolean;
};

const KAKAO_SDK_ID = "kakao-map-sdk";

const getDistrictCenters = () => {
  const centers = new globalThis.Map<string, { lat: number; lng: number }>();

  seoulGeoJson.features.forEach((feature: any) => {
    const guName = feature.properties.SIG_KOR_NM;
    const center = getCenterFromLngLatPoints(
      getGeoJsonLngLatPoints(feature.geometry as GeoJsonLngLatGeometry),
    );

    if (!center) return;

    centers.set(guName, center);
  });

  return centers;
};

const getDistrictCodeMap = () => {
  const codes = new globalThis.Map<string, string>();

  seoulGeoJson.features.forEach((feature: any) => {
    codes.set(feature.properties.SIG_KOR_NM, feature.properties.SIG_CD);
  });

  return codes;
};

const getRegionCenters = () => {
  const regionPoints = new globalThis.Map<string, number[][]>();

  seoulGeoJson.features.forEach((feature: any) => {
    const guName = feature.properties.SIG_KOR_NM;
    const region = regionMap[guName];

    if (!region) return;

    const points = getGeoJsonLngLatPoints(
      feature.geometry as GeoJsonLngLatGeometry,
    );
    const existingPoints = regionPoints.get(region) ?? [];

    regionPoints.set(region, [...existingPoints, ...points]);
  });

  const centers = new globalThis.Map<string, { lat: number; lng: number }>();

  regionPoints.forEach((points: number[][], region: string) => {
    if (points.length === 0) return;

    const center = getCenterFromLngLatPoints(points);

    if (!center) return;

    centers.set(region, center);
  });

  return centers;
};

const regionCenters = getRegionCenters();
const districtCenters = getDistrictCenters();
const districtCodeMap = getDistrictCodeMap();

const Map = ({ enableOverlay = true }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapRefInstance = useRef<any>(null);
  const overlayRef = useRef<any>(null);
  const basicPolygonsRef = useRef<any[]>([]);
  const rentIndexOverlaysRef = useRef<any[]>([]);
  const subwayIndexOverlaysRef = useRef<any[]>([]);
  const safetyIndexOverlaysRef = useRef<any[]>([]);
  const selectedSafetyDistrictPolygonsRef = useRef<any[]>([]);
  const selectedHomeRecommendationPolygonsRef = useRef<any[]>([]);
  const selectedHomeSubwayDistrictPolygonsRef = useRef<any[]>([]);
  const selectedTransportDongPolygonsRef = useRef<any[]>([]);
  const selectedHomeRecommendationLabelRef = useRef<any>(null);
  const subwayLinePolylineRefs = useRef<any[]>([]);
  const subwayStationMarkerRefs = useRef<any[]>([]);
  const convenienceMarkersRef = useRef<any[]>([]);
  const selectedRegionPolygonsRef = useRef<any[]>([]);
  const consumerIndexPolygonsRef = useRef<any[]>([]);
  const rentIndexItems = useMapOverlayStore((state) => state.rentIndexItems);
  const selectedRentIndexItem = useMapOverlayStore(
    (state) => state.selectedRentIndexItem,
  );
  const consumerIndexItem = useMapOverlayStore(
    (state) => state.consumerIndexItem,
  );
  const subwayIndexItems = useMapOverlayStore(
    (state) => state.subwayIndexItems,
  );
  const safetyIndexItems = useMapOverlayStore(
    (state) => state.safetyIndexItems,
  );
  const selectedHomeSubwayRanking = useMapOverlayStore(
    (state) => state.selectedHomeSubwayRanking,
  );
  const selectedHomeRecommendationName = useMapOverlayStore(
    (state) => state.selectedHomeRecommendationName,
  );
  const selectedTransportNeighborhoodName = useMapOverlayStore(
    (state) => state.selectedTransportNeighborhoodName,
  );
  const subwayLinePolylines = useMapOverlayStore(
    (state) => state.subwayLinePolylines,
  );
  const subwayStationMarkers = useMapOverlayStore(
    (state) => state.subwayStationMarkers,
  );
  const selectedSubwayStationMarker = useMapOverlayStore(
    (state) => state.selectedSubwayStationMarker,
  );
  const conveniencePins = useMapOverlayStore((state) => state.conveniencePins);
  const convenienceMarkerType = useMapOverlayStore(
    (state) => state.convenienceMarkerType,
  );

  const [mapType, setMapType] = useState<"roadmap" | "skyview">("roadmap");
  const [isMapReady, setIsMapReady] = useState(false);

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

    setIsMapReady(true);

    // setCurrentLocation(map);
  };

  const clearBasicPolygons = () => {
    clearBasicDistrictPolygons(basicPolygonsRef.current);
  };

  const clearRentIndexOverlays = () => {
    clearRentIndexOverlayRefs(rentIndexOverlaysRef.current);
  };

  const clearSubwayIndexOverlays = () => {
    clearSubwayIndexOverlayRefs(subwayIndexOverlaysRef.current);
  };

  const clearSafetyIndexOverlays = () => {
    clearSafetyIndexOverlayRefs(safetyIndexOverlaysRef.current);
  };

  const clearSelectedSafetyDistrictPolygons = () => {
    clearSelectedSafetyDistrictPolygonRefs(
      selectedSafetyDistrictPolygonsRef.current,
    );
  };

  const clearSelectedHomeSubwayDistrictPolygons = () => {
    clearHomeSubwayDistrictOverlay(
      selectedHomeSubwayDistrictPolygonsRef.current,
    );
  };

  const clearSelectedHomeRecommendationPolygons = () => {
    clearRecommendationDongOverlay({
      polygonRefs: selectedHomeRecommendationPolygonsRef.current,
      labelRef: selectedHomeRecommendationLabelRef,
    });
  };

  const clearSelectedTransportDongPolygons = () => {
    clearTransportDongOverlay(selectedTransportDongPolygonsRef.current);
  };

  const clearSelectedRegionPolygons = () => {
    clearSelectedRegionPolygonRefs(selectedRegionPolygonsRef.current);
  };

  // const createPolygon = (map: any, rings: number[][][], properties: any) => {
  //   const paths = rings.map((ring) =>
  //     ring.map(([lng, lat]) => new window.kakao.maps.LatLng(lat, lng)),
  //   );

  //   const polygon = new window.kakao.maps.Polygon({
  //     map,
  //     path: paths,
  //     ...POLYGON_STYLE,
  //   });

  //   window.kakao.maps.event.addListener(
  //     polygon,
  //     "mouseover",
  //     (mouseEvent: any) => {
  //       polygon.setOptions(mouseoverOption);

  //       if (!overlayRef.current) return;

  //       overlayRef.current.setContent(`
  //         <div style="
  //           padding:6px 10px;
  //           background:white;
  //           border-radius:6px;
  //           font-size:12px;
  //           box-shadow:0 2px 6px rgba(0,0,0,0.2);
  //         ">
  //           ${properties.SIG_KOR_NM}
  //         </div>
  //       `);

  //       overlayRef.current.setPosition(mouseEvent.latLng);
  //       overlayRef.current.setMap(map);
  //     },
  //   );

  //   window.kakao.maps.event.addListener(polygon, "mouseout", () => {
  //     polygon.setOptions(mouseoutOption);

  //     if (overlayRef.current) {
  //       overlayRef.current.setMap(null);
  //     }
  //   });
  // };

  /* ------------------------- Current Location ------------------------- */

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

  useEffect(() => {
    if (!isMapReady || !mapRefInstance.current) return;

    if (enableOverlay) {
      if (basicPolygonsRef.current.length === 0) {
        drawBasicDistrictPolygons({
          map: mapRefInstance.current,
          overlay: overlayRef.current,
          enableOverlay,
          polygonRefs: basicPolygonsRef.current,
        });
      }
    } else {
      clearBasicPolygons();
    }
  }, [enableOverlay, isMapReady]);

  useEffect(() => {
    if (!isMapReady || !mapRefInstance.current) return;

    drawRentIndexOverlays({
      map: mapRefInstance.current,
      items: rentIndexItems,
      regionCenters,
      overlayRefs: rentIndexOverlaysRef.current,
      selectedPolygonRefs: selectedRegionPolygonsRef.current,
    });

    return () => {
      clearRentIndexOverlays();
      clearSelectedRegionPolygons();
    };
  }, [isMapReady, rentIndexItems]);

  useEffect(() => {
    if (!isMapReady || !mapRefInstance.current) return;

    drawSubwayIndexOverlays({
      map: mapRefInstance.current,
      items: subwayIndexItems,
      districtCenters,
      overlayRefs: subwayIndexOverlaysRef.current,
    });

    return () => {
      clearSubwayIndexOverlays();
    };
  }, [isMapReady, subwayIndexItems]);

  useEffect(() => {
    if (!isMapReady || !mapRefInstance.current) return;

    drawSafetyIndexOverlays({
      map: mapRefInstance.current,
      items: safetyIndexItems,
      districtCenters,
      overlayRefs: safetyIndexOverlaysRef.current,
      selectedPolygonRefs: selectedSafetyDistrictPolygonsRef.current,
    });

    return () => {
      clearSafetyIndexOverlays();
      clearSelectedSafetyDistrictPolygons();
    };
  }, [isMapReady, safetyIndexItems]);

  useEffect(() => {
    if (!isMapReady || !mapRefInstance.current) return;

    drawRecommendationDongOverlay({
      map: mapRefInstance.current,
      neighborhoodName: selectedHomeRecommendationName,
      districtCodeMap,
      polygonRefs: selectedHomeRecommendationPolygonsRef.current,
      labelRef: selectedHomeRecommendationLabelRef,
    });

    return () => {
      clearSelectedHomeRecommendationPolygons();
    };
  }, [isMapReady, selectedHomeRecommendationName]);

  useEffect(() => {
    if (!isMapReady || !mapRefInstance.current) return;

    drawHomeSubwayDistrictOverlay({
      map: mapRefInstance.current,
      item: selectedHomeSubwayRanking,
      districtCenters,
      polygonRefs: selectedHomeSubwayDistrictPolygonsRef.current,
    });

    return () => {
      clearSelectedHomeSubwayDistrictPolygons();
    };
  }, [isMapReady, selectedHomeSubwayRanking]);

  useEffect(() => {
    if (!isMapReady || !mapRefInstance.current) return;

    drawTransportDongOverlay({
      map: mapRefInstance.current,
      neighborhoodName: selectedTransportNeighborhoodName,
      districtCodeMap,
      polygonRefs: selectedTransportDongPolygonsRef.current,
    });

    return () => {
      clearSelectedTransportDongPolygons();
    };
  }, [isMapReady, selectedTransportNeighborhoodName]);

  useEffect(() => {
    if (!isMapReady || !mapRefInstance.current) return;

    drawSubwayLinePolylines({
      map: mapRefInstance.current,
      polylines: subwayLinePolylines,
      polylineRefs: subwayLinePolylineRefs.current,
    });

    return () => {
      clearSubwayLinePolylines(subwayLinePolylineRefs.current);
    };
  }, [isMapReady, subwayLinePolylines]);

  useEffect(() => {
    if (!isMapReady || !mapRefInstance.current) return;

    drawSubwayStationMarkers({
      map: mapRefInstance.current,
      markers: subwayStationMarkers,
      markerRefs: subwayStationMarkerRefs.current,
    });

    return () => {
      clearSubwayStationMarkers(subwayStationMarkerRefs.current);
    };
  }, [isMapReady, subwayStationMarkers]);

  useEffect(() => {
    if (
      !isMapReady ||
      !mapRefInstance.current ||
      !selectedSubwayStationMarker
    ) {
      return;
    }

    const position = new window.kakao.maps.LatLng(
      selectedSubwayStationMarker.latitude,
      selectedSubwayStationMarker.longitude,
    );

    mapRefInstance.current.setLevel(4);
    mapRefInstance.current.panTo(position);
  }, [isMapReady, selectedSubwayStationMarker]);

  useEffect(() => {
    if (!isMapReady || !mapRefInstance.current) return;

    drawConvenienceMarkers({
      map: mapRefInstance.current,
      pins: conveniencePins,
      markerType: convenienceMarkerType,
      markerRefs: convenienceMarkersRef.current,
    });

    return () => {
      clearConvenienceMarkers(convenienceMarkersRef.current);
    };
  }, [convenienceMarkerType, conveniencePins, isMapReady]);

  useEffect(() => {
    if (!isMapReady || !mapRefInstance.current) return;

    drawConsumerIndexPolygons({
      map: mapRefInstance.current,
      item: consumerIndexItem,
      overlay: overlayRef.current,
      createPolygonPaths,
      polygonRefs: consumerIndexPolygonsRef.current,
    });

    return () => {
      clearConsumerIndexPolygons(consumerIndexPolygonsRef.current);
    };
  }, [consumerIndexItem, isMapReady]);

  useEffect(() => {
    if (!isMapReady || !mapRefInstance.current || !selectedRentIndexItem) {
      return;
    }

    selectRentIndexItemOnMap({
      map: mapRefInstance.current,
      item: selectedRentIndexItem,
      regionCenters,
      overlayRefs: rentIndexOverlaysRef.current,
      selectedPolygonRefs: selectedRegionPolygonsRef.current,
    });
  }, [isMapReady, selectedRentIndexItem]);

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
