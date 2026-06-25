import { useEffect, useRef, useState } from "react";
// import seoulGeoJson from "@/assets/geojson/seoul-gu.json";
import seoulGeoJson from "@/assets/geojson/seoul-gu-simple.json";
import { regionMap } from "@/constants/regionMap";
import { regionColor, regionBoundaryColor } from "@/constants/regionColor";
import { useMapOverlayStore } from "@/store/mapOverlayStore";
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
  createPolygonPaths,
  getCenterFromLngLatPoints,
  getGeoJsonLngLatPoints,
  type GeoJsonLngLatGeometry,
} from "@/components/mapOverlays/geoJson";
import { getSubwayLineColor } from "@/utils/subwayLineStyle";
import cafeMarkerUrl from "@/assets/icons/maker/cafe_marker.svg";
import convenienceMarkerUrl from "@/assets/icons/maker/conv_marker.svg";
import hospitalMarkerUrl from "@/assets/icons/maker/hospital_marker.svg";
import martMarkerUrl from "@/assets/icons/maker/mart_marker.svg";
import type {
  ConvenienceMapPin,
  ConvenienceMarkerType,
  HomeSubwayRankingMapItem,
  RentIndexMapOverlayItem,
  RentIndexMapOverlayType,
  SafetyIndexMapOverlayItem,
  SubwayIndexMapOverlayItem,
  SubwayLinePolyline,
  SubwayStationMarker,
} from "@/store/mapOverlayStore";

declare global {
  interface Window {
    kakao: any;
  }
}

type Props = {
  enableOverlay?: boolean;
};

const KAKAO_SDK_ID = "kakao-map-sdk";

const getRegionName = (name: string) => {
  return name.split(" ").at(-1) ?? name;
};

const getOverlayColor = (type: RentIndexMapOverlayType) => {
  if (type === "RISE") return "#FF5555";
  if (type === "FALL") return "#4D8DFF";
  return "#3385FF";
};

const getOverlayValueLabel = (item: RentIndexMapOverlayItem) => {
  if (item.type === "CURRENT") {
    return item.value.toFixed(1);
  }

  const prefix = item.type === "RISE" && item.value > 0 ? "+" : "";

  return `${prefix}${item.value.toFixed(0)}%`;
};

const getSubwayIndexOverlayColor = (value: number) => {
  if (value >= 100.8) return "#FF0000";
  if (value >= 100.6) return "#FF8000";
  if (value >= 100.4) return "#66D575";
  return "#005EFF";
};

const getSafetyIndexOverlayColor = (value: number) => {
  if (value >= 45) return "#FF0000";
  if (value >= 35) return "#FF8000";
  if (value >= 25) return "#66D575";
  return "#005EFF";
};

const getSubwayStationMarkerImage = (color: string) => {
  const markerSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="10" fill="${color}" stroke="white" stroke-width="4"/>
      <circle cx="14" cy="14" r="4" fill="white"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markerSvg)}`;
};

const convenienceMarkerImageMap: Record<ConvenienceMarkerType, string> = {
  mart: martMarkerUrl,
  convenienceStore: convenienceMarkerUrl,
  hospital: hospitalMarkerUrl,
  cafe: cafeMarkerUrl,
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

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

  /* ------------------------- GeoJSON ------------------------- */

  const drawBasicGeoJSON = (map: any) => {
    seoulGeoJson.features.forEach((feature: any) => {
      const { geometry, properties } = feature;

      if (geometry.type === "Polygon") {
        createBasicPolygon(map, geometry.coordinates, properties);
      }

      if (geometry.type === "MultiPolygon") {
        geometry.coordinates.forEach((coords: any) => {
          createBasicPolygon(map, coords, properties);
        });
      }
    });
  };

  const createBasicPolygon = (
    map: any,
    rings: number[][][],
    properties: any,
  ) => {
    const paths = createPolygonPaths(rings);

    const guName = properties.SIG_KOR_NM;
    const region = regionMap[guName];
    const fillColor = regionColor[region] ?? "#C4ECFE";
    const strokeColor = regionBoundaryColor[region] ?? "#C4ECFE";

    const polygon = new window.kakao.maps.Polygon({
      map,
      path: paths,
      strokeWeight: 2,
      strokeColor,
      strokeOpacity: 1,
      fillColor,
      fillOpacity: 0.6,
    });

    basicPolygonsRef.current.push(polygon);

    /* ---------------- Hover ---------------- */

    window.kakao.maps.event.addListener(
      polygon,
      "mouseover",
      (mouseEvent: any) => {
        polygon.setOptions({
          fillOpacity: 0.9,
        });

        if (!overlayRef.current || !enableOverlay) return;

        overlayRef.current.setContent(`
        <div style="
          padding:6px 20px;
          background:white;
          text-align: center;
          border-radius: 3px;
          font-size: 14px;
          font-family:'Pretendard', sans-serif;
          box-shadow:0 2px 6px rgba(0,0,0,0.2);
        ">
          ${region}<br/>
          ${guName}
        </div>
      `);

        overlayRef.current.setPosition(mouseEvent.latLng);
        overlayRef.current.setMap(map);
      },
    );

    window.kakao.maps.event.addListener(polygon, "mouseout", () => {
      polygon.setOptions({
        fillOpacity: 0.6,
      });

      if (overlayRef.current) {
        overlayRef.current.setMap(null);
      }
    });
  };

  const clearBasicPolygons = () => {
    basicPolygonsRef.current.forEach((polygon) => {
      polygon.setMap(null);
    });
    basicPolygonsRef.current = [];
  };

  const clearRentIndexOverlays = () => {
    rentIndexOverlaysRef.current.forEach((overlay) => {
      overlay.setMap(null);
    });
    rentIndexOverlaysRef.current = [];
  };

  const clearSubwayIndexOverlays = () => {
    subwayIndexOverlaysRef.current.forEach((overlay) => {
      overlay.setMap(null);
    });
    subwayIndexOverlaysRef.current = [];
  };

  const clearSafetyIndexOverlays = () => {
    safetyIndexOverlaysRef.current.forEach((overlay) => {
      overlay.setMap(null);
    });
    safetyIndexOverlaysRef.current = [];
  };

  const clearSelectedSafetyDistrictPolygons = () => {
    selectedSafetyDistrictPolygonsRef.current.forEach((polygon) => {
      polygon.setMap(null);
    });
    selectedSafetyDistrictPolygonsRef.current = [];
  };

  const clearSelectedHomeSubwayDistrictPolygons = () => {
    selectedHomeSubwayDistrictPolygonsRef.current.forEach((polygon) => {
      polygon.setMap(null);
    });
    selectedHomeSubwayDistrictPolygonsRef.current = [];
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

  const clearSubwayLinePolylineOverlays = () => {
    subwayLinePolylineRefs.current.forEach((polyline) => {
      polyline.setMap(null);
    });
    subwayLinePolylineRefs.current = [];
  };

  const clearSubwayStationMarkers = () => {
    subwayStationMarkerRefs.current.forEach((marker) => {
      marker.setMap(null);
    });
    subwayStationMarkerRefs.current = [];
  };

  const clearConvenienceMarkers = () => {
    convenienceMarkersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    convenienceMarkersRef.current = [];
  };

  const clearSelectedRegionPolygons = () => {
    selectedRegionPolygonsRef.current.forEach((polygon) => {
      polygon.setMap(null);
    });
    selectedRegionPolygonsRef.current = [];
  };

  const drawSelectedRegionPolygons = (
    map: any,
    regionName: string,
    type: RentIndexMapOverlayType,
  ) => {
    clearSelectedRegionPolygons();

    const fillColor = getOverlayColor(type);

    seoulGeoJson.features.forEach((feature: any) => {
      const guName = feature.properties.SIG_KOR_NM;

      if (regionMap[guName] !== regionName) return;

      const { geometry } = feature;
      const polygons =
        geometry.type === "Polygon"
          ? [geometry.coordinates]
          : geometry.coordinates;

      polygons.forEach((rings: number[][][]) => {
        const polygon = new window.kakao.maps.Polygon({
          map,
          path: createPolygonPaths(rings),
          strokeWeight: 3,
          strokeColor: fillColor,
          strokeOpacity: 1,
          fillColor,
          fillOpacity: 0.28,
          zIndex: 4,
        });

        selectedRegionPolygonsRef.current.push(polygon);
      });
    });
  };

  const createRentIndexOverlayContent = (
    item: RentIndexMapOverlayItem,
    color: string,
    onClick: () => void,
  ) => {
    const button = document.createElement("button");
    button.type = "button";
    button.style.width = "145px";
    button.style.height = "145px";
    button.style.border = "none";
    button.style.borderRadius = "9999px";
    button.style.background = color;
    button.style.opacity = "0.82";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.color = "white";
    button.style.fontSize = "24px";
    button.style.fontWeight = "700";
    button.style.fontFamily = "'Pretendard', sans-serif";
    button.style.textShadow = "0 1px 2px rgba(0,0,0,0.2)";
    button.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
    button.style.cursor = "pointer";
    button.style.padding = "0";
    button.textContent = getOverlayValueLabel(item);

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      onClick();
    });

    return button;
  };

  const drawRentIndexOverlays = (
    map: any,
    items: RentIndexMapOverlayItem[],
  ) => {
    clearRentIndexOverlays();

    items.forEach((item) => {
      const region = getRegionName(item.name);
      const center = regionCenters.get(region);

      if (!center) return;

      const color = getOverlayColor(item.type);
      const content = createRentIndexOverlayContent(item, color, () => {
        selectRentIndexItemOnMap(map, item);
      });
      const overlay = new window.kakao.maps.CustomOverlay({
        map,
        position: new window.kakao.maps.LatLng(center.lat, center.lng),
        zIndex: 5,
        content,
      });

      rentIndexOverlaysRef.current.push(overlay);
    });
  };

  const createSubwayIndexOverlayContent = (
    item: SubwayIndexMapOverlayItem,
    color: string,
  ) => {
    const container = document.createElement("div");
    container.style.width = "97px";
    container.style.height = "73px";
    container.style.background = color;
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.color = "white";
    container.style.fontFamily = "'Pretendard', sans-serif";
    container.style.fontWeight = "700";
    container.style.boxShadow = "0 3px 8px rgba(0,0,0,0.16)";
    container.style.textShadow = "0 1px 2px rgba(0,0,0,0.2)";

    const name = document.createElement("div");
    name.style.fontSize = "15px";
    name.style.fontWeight = "700";
    name.style.lineHeight = "1.2";
    name.textContent = getRegionName(item.name);

    const value = document.createElement("div");
    value.style.fontSize = "15px";
    value.style.fontWeight = "700";
    value.style.lineHeight = "1.2";
    value.textContent = `${item.value.toFixed(1)}점`;

    container.append(name, value);

    return container;
  };

  const drawSubwayIndexOverlays = (
    map: any,
    items: SubwayIndexMapOverlayItem[],
  ) => {
    clearSubwayIndexOverlays();

    items.forEach((item) => {
      const district = getRegionName(item.name);
      const center = districtCenters.get(district);

      if (!center) return;

      const overlay = new window.kakao.maps.CustomOverlay({
        map,
        position: new window.kakao.maps.LatLng(center.lat, center.lng),
        zIndex: 6,
        content: createSubwayIndexOverlayContent(
          item,
          getSubwayIndexOverlayColor(item.value),
        ),
      });

      subwayIndexOverlaysRef.current.push(overlay);
    });
  };

  const createSafetyIndexOverlayContent = (
    item: SafetyIndexMapOverlayItem,
    color: string,
  ) => {
    const container = document.createElement("div");
    container.style.width = "97px";
    container.style.height = "73px";
    container.style.background = color;
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.color = "white";
    container.style.fontFamily = "'Pretendard', sans-serif";
    container.style.fontWeight = "700";
    container.style.boxShadow = "0 3px 8px rgba(0,0,0,0.16)";
    container.style.textShadow = "0 1px 2px rgba(0,0,0,0.2)";

    const name = document.createElement("div");
    name.style.fontSize = "15px";
    name.style.fontWeight = "700";
    name.style.lineHeight = "1.2";
    name.textContent = getRegionName(item.name);

    const value = document.createElement("div");
    value.style.fontSize = "15px";
    value.style.fontWeight = "700";
    value.style.lineHeight = "1.2";
    value.textContent = `${item.value.toFixed(1)}점`;

    container.append(name, value);

    return container;
  };

  const drawSafetyIndexOverlays = (
    map: any,
    items: SafetyIndexMapOverlayItem[],
  ) => {
    clearSafetyIndexOverlays();
    clearSelectedSafetyDistrictPolygons();

    const bounds = new window.kakao.maps.LatLngBounds();

    items.forEach((item) => {
      const district = getRegionName(item.name);
      const center = districtCenters.get(district);

      if (!center) return;

      const position = new window.kakao.maps.LatLng(center.lat, center.lng);

      const overlay = new window.kakao.maps.CustomOverlay({
        map,
        position,
        zIndex: 6,
        content: createSafetyIndexOverlayContent(
          item,
          getSafetyIndexOverlayColor(item.value),
        ),
      });

      safetyIndexOverlaysRef.current.push(overlay);
      bounds.extend(position);
    });

    if (items.length === 1) {
      const district = getRegionName(items[0].name);
      const center = districtCenters.get(district);

      if (!center) return;

      drawSelectedSafetyDistrictPolygon(
        map,
        district,
        getSafetyIndexOverlayColor(items[0].value),
      );
      map.setLevel(6);
      map.setCenter(new window.kakao.maps.LatLng(center.lat, center.lng));
      return;
    }

    if (items.length > 1) {
      map.setBounds(bounds);
    }
  };

  const drawSelectedSafetyDistrictPolygon = (
    map: any,
    districtName: string,
    color: string,
  ) => {
    seoulGeoJson.features.forEach((feature: any) => {
      const guName = feature.properties.SIG_KOR_NM;

      if (guName !== districtName) return;

      const { geometry } = feature;
      const polygons =
        geometry.type === "Polygon"
          ? [geometry.coordinates]
          : geometry.coordinates;

      polygons.forEach((rings: number[][][]) => {
        const polygon = new window.kakao.maps.Polygon({
          map,
          path: createPolygonPaths(rings),
          strokeWeight: 3,
          strokeColor: color,
          strokeOpacity: 1,
          fillColor: color,
          fillOpacity: 0.24,
          zIndex: 5,
        });

        selectedSafetyDistrictPolygonsRef.current.push(polygon);
      });
    });
  };

  const drawSelectedHomeSubwayDistrictPolygon = (
    map: any,
    item: HomeSubwayRankingMapItem | null,
  ) => {
    clearSelectedHomeSubwayDistrictPolygons();

    if (!item) {
      return;
    }

    const districtName = getRegionName(item.name);
    const center = districtCenters.get(districtName);
    const color = "#3385FF";

    if (!center) {
      return;
    }

    seoulGeoJson.features.forEach((feature: any) => {
      if (feature.properties.SIG_KOR_NM !== districtName) {
        return;
      }

      const { geometry } = feature;
      const polygons =
        geometry.type === "Polygon"
          ? [geometry.coordinates]
          : geometry.coordinates;

      polygons.forEach((rings: number[][][]) => {
        const polygon = new window.kakao.maps.Polygon({
          map,
          path: createPolygonPaths(rings),
          strokeWeight: 3,
          strokeColor: color,
          strokeOpacity: 1,
          fillColor: color,
          fillOpacity: 0.28,
          zIndex: 7,
        });

        selectedHomeSubwayDistrictPolygonsRef.current.push(polygon);
      });
    });

    map.setLevel(6);
    map.panTo(new window.kakao.maps.LatLng(center.lat, center.lng));
  };

  const drawConvenienceMarkers = (
    map: any,
    pins: ConvenienceMapPin[],
    markerType: ConvenienceMarkerType | null,
  ) => {
    clearConvenienceMarkers();

    if (pins.length === 0) {
      return;
    }

    const bounds = new window.kakao.maps.LatLngBounds();
    const markerImage = markerType
      ? new window.kakao.maps.MarkerImage(
          convenienceMarkerImageMap[markerType],
          new window.kakao.maps.Size(32, 32),
          {
            offset: new window.kakao.maps.Point(16, 16),
          },
        )
      : undefined;

    pins.forEach((pin) => {
      const position = new window.kakao.maps.LatLng(
        pin.latitude,
        pin.longitude,
      );
      const marker = new window.kakao.maps.Marker({
        map,
        position,
        title: pin.name,
        image: markerImage,
      });

      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:6px 10px;font-size:12px;white-space:nowrap;">${escapeHtml(pin.name)}</div>`,
      });

      window.kakao.maps.event.addListener(marker, "mouseover", () => {
        infoWindow.open(map, marker);
      });
      window.kakao.maps.event.addListener(marker, "mouseout", () => {
        infoWindow.close();
      });

      convenienceMarkersRef.current.push(marker);
      bounds.extend(position);
    });

    if (pins.length === 1) {
      map.panTo(
        new window.kakao.maps.LatLng(pins[0].latitude, pins[0].longitude),
      );
      map.setLevel(4);
      return;
    }

    map.setBounds(bounds);
  };

  const drawSubwayLinePolylines = (
    map: any,
    polylines: SubwayLinePolyline[],
  ) => {
    clearSubwayLinePolylineOverlays();

    polylines.forEach((polyline) => {
      const path = polyline.path.map(
        (point) => new window.kakao.maps.LatLng(point.latitude, point.longitude),
      );

      const subwayLinePolyline = new window.kakao.maps.Polyline({
        map,
        path,
        strokeWeight: 5,
        strokeColor: polyline.color ?? getSubwayLineColor(polyline.lineName),
        strokeOpacity: 0.88,
        strokeStyle: "solid",
        zIndex: 8,
      });

      subwayLinePolylineRefs.current.push(subwayLinePolyline);
    });
  };

  const drawSubwayStationMarkers = (
    map: any,
    markers: SubwayStationMarker[],
  ) => {
    clearSubwayStationMarkers();

    markers.forEach((marker) => {
      const color = marker.color ?? getSubwayLineColor(marker.lineName);
      const position = new window.kakao.maps.LatLng(
        marker.latitude,
        marker.longitude,
      );
      const markerImage = new window.kakao.maps.MarkerImage(
        getSubwayStationMarkerImage(color),
        new window.kakao.maps.Size(28, 28),
        {
          offset: new window.kakao.maps.Point(14, 14),
        },
      );
      const subwayStationMarker = new window.kakao.maps.Marker({
        map,
        position,
        title: marker.stationName,
        image: markerImage,
        zIndex: 9,
      });
      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:6px 10px;font-size:12px;white-space:nowrap;">${escapeHtml(marker.stationName)} · ${escapeHtml(marker.lineName)}</div>`,
      });

      window.kakao.maps.event.addListener(subwayStationMarker, "mouseover", () => {
        infoWindow.open(map, subwayStationMarker);
      });
      window.kakao.maps.event.addListener(subwayStationMarker, "mouseout", () => {
        infoWindow.close();
      });

      subwayStationMarkerRefs.current.push(subwayStationMarker);
    });
  };

  const selectRentIndexItemOnMap = (
    map: any,
    item: RentIndexMapOverlayItem,
  ) => {
    const region = getRegionName(item.name);
    const center = regionCenters.get(region);

    if (!center) return;

    drawSelectedRegionPolygons(map, region, item.type);
    clearRentIndexOverlays();
    map.panTo(new window.kakao.maps.LatLng(center.lat, center.lng));
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
        drawBasicGeoJSON(mapRefInstance.current);
      }
    } else {
      clearBasicPolygons();
    }
  }, [enableOverlay, isMapReady]);

  useEffect(() => {
    if (!isMapReady || !mapRefInstance.current) return;

    drawRentIndexOverlays(mapRefInstance.current, rentIndexItems);

    return () => {
      clearRentIndexOverlays();
      clearSelectedRegionPolygons();
    };
  }, [isMapReady, rentIndexItems]);

  useEffect(() => {
    if (!isMapReady || !mapRefInstance.current) return;

    drawSubwayIndexOverlays(mapRefInstance.current, subwayIndexItems);

    return () => {
      clearSubwayIndexOverlays();
    };
  }, [isMapReady, subwayIndexItems]);

  useEffect(() => {
    if (!isMapReady || !mapRefInstance.current) return;

    drawSafetyIndexOverlays(mapRefInstance.current, safetyIndexItems);

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

    drawSelectedHomeSubwayDistrictPolygon(
      mapRefInstance.current,
      selectedHomeSubwayRanking,
    );

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

    drawSubwayLinePolylines(mapRefInstance.current, subwayLinePolylines);

    return () => {
      clearSubwayLinePolylineOverlays();
    };
  }, [isMapReady, subwayLinePolylines]);

  useEffect(() => {
    if (!isMapReady || !mapRefInstance.current) return;

    drawSubwayStationMarkers(mapRefInstance.current, subwayStationMarkers);

    return () => {
      clearSubwayStationMarkers();
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

    drawConvenienceMarkers(
      mapRefInstance.current,
      conveniencePins,
      convenienceMarkerType,
    );

    return () => {
      clearConvenienceMarkers();
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

    selectRentIndexItemOnMap(mapRefInstance.current, selectedRentIndexItem);
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
