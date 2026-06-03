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
import cafeMarkerUrl from "@/assets/icons/maker/cafe_marker.svg";
import convenienceMarkerUrl from "@/assets/icons/maker/conv_marker.svg";
import hospitalMarkerUrl from "@/assets/icons/maker/hospital_marker.svg";
import martMarkerUrl from "@/assets/icons/maker/mart_marker.svg";
import type {
  ConvenienceMapPin,
  ConvenienceMarkerType,
  RentIndexMapOverlayItem,
  RentIndexMapOverlayType,
  SafetyIndexMapOverlayItem,
  SubwayIndexMapOverlayItem,
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

const getGeoJsonLngLatPoints = (geometry: any) => {
  const points: number[][] = [];

  if (geometry.type === "Polygon") {
    geometry.coordinates.forEach((ring: number[][]) => {
      points.push(...ring);
    });
  }

  if (geometry.type === "MultiPolygon") {
    geometry.coordinates.forEach((polygon: number[][][]) => {
      polygon.forEach((ring: number[][]) => {
        points.push(...ring);
      });
    });
  }

  return points;
};

const getCenterFromLngLatPoints = (points: number[][]) => {
  if (points.length === 0) return null;

  const bounds = points.reduce(
    (
      acc: {
        minLat: number;
        maxLat: number;
        minLng: number;
        maxLng: number;
      },
      [lng, lat]: number[],
    ) => ({
      minLat: Math.min(acc.minLat, lat),
      maxLat: Math.max(acc.maxLat, lat),
      minLng: Math.min(acc.minLng, lng),
      maxLng: Math.max(acc.maxLng, lng),
    }),
    {
      minLat: Number.POSITIVE_INFINITY,
      maxLat: Number.NEGATIVE_INFINITY,
      minLng: Number.POSITIVE_INFINITY,
      maxLng: Number.NEGATIVE_INFINITY,
    },
  );

  return {
    lat: (bounds.minLat + bounds.maxLat) / 2,
    lng: (bounds.minLng + bounds.maxLng) / 2,
  };
};

const getDistrictCenters = () => {
  const centers = new globalThis.Map<string, { lat: number; lng: number }>();

  seoulGeoJson.features.forEach((feature: any) => {
    const guName = feature.properties.SIG_KOR_NM;
    const center = getCenterFromLngLatPoints(
      getGeoJsonLngLatPoints(feature.geometry),
    );

    if (!center) return;

    centers.set(guName, center);
  });

  return centers;
};

const getRegionCenters = () => {
  const regionPoints = new globalThis.Map<string, number[][]>();

  seoulGeoJson.features.forEach((feature: any) => {
    const guName = feature.properties.SIG_KOR_NM;
    const region = regionMap[guName];

    if (!region) return;

    const points = getGeoJsonLngLatPoints(feature.geometry);
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

const Map = ({ enableOverlay = true }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapRefInstance = useRef<any>(null);
  const overlayRef = useRef<any>(null);
  const basicPolygonsRef = useRef<any[]>([]);
  const rentIndexOverlaysRef = useRef<any[]>([]);
  const subwayIndexOverlaysRef = useRef<any[]>([]);
  const safetyIndexOverlaysRef = useRef<any[]>([]);
  const selectedSafetyDistrictPolygonsRef = useRef<any[]>([]);
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

  const createPolygonPaths = (rings: number[][][]) => {
    return rings.map((ring) =>
      ring.map(([lng, lat]) => new window.kakao.maps.LatLng(lat, lng)),
    );
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
