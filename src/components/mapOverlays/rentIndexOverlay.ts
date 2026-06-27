import seoulGeoJson from "@/assets/geojson/seoul-gu-simple.json";
import { regionMap } from "@/constants/regionMap";
import {
  createPolygonPaths,
  getCenterFromLngLatPoints,
  getGeoJsonLngLatPoints,
  type GeoJsonLngLatGeometry,
} from "@/components/mapOverlays/geoJson";
import type {
  RentIndexMapOverlayItem,
  RentIndexMapOverlayType,
} from "@/store/mapOverlayStore";

type KakaoMap = {
  panTo: (position: unknown) => void;
};

type KakaoOverlay = {
  setMap: (map: KakaoMap | null) => void;
};

type KakaoMapElement = {
  setMap: (map: KakaoMap | null) => void;
};

type RegionCenter = {
  lat: number;
  lng: number;
};

type DistrictGeoJsonFeature = {
  properties: {
    SIG_KOR_NM: string;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
};

type DrawRentIndexOverlaysParams = {
  map: KakaoMap;
  items: RentIndexMapOverlayItem[];
  regionCenters: globalThis.Map<string, RegionCenter>;
  overlayRefs: KakaoOverlay[];
  selectedPolygonRefs: KakaoMapElement[];
};

type SelectRentIndexItemParams = {
  map: KakaoMap;
  item: RentIndexMapOverlayItem;
  regionCenters: globalThis.Map<string, RegionCenter>;
  overlayRefs: KakaoOverlay[];
  selectedPolygonRefs: KakaoMapElement[];
};

const getRegionName = (name: string) => {
  return name.split(" ").at(-1) ?? name;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

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

const createDistrictNameLabelContent = (
  districtName: string,
  color: string,
) => `
  <div style="
    min-width: 54px;
    padding: 7px 10px;
    border: 1px solid ${color}33;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.95);
    color: #111827;
    font-family: Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 12px;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: 0;
    text-align: center;
    box-shadow: 0 8px 22px rgba(15, 23, 42, 0.16), 0 2px 6px rgba(15, 23, 42, 0.08);
    white-space: nowrap;
  ">
    ${escapeHtml(districtName)}
  </div>
`;

export const clearRentIndexOverlays = (overlayRefs: KakaoOverlay[]) => {
  overlayRefs.forEach((overlay) => {
    overlay.setMap(null);
  });
  overlayRefs.length = 0;
};

export const clearSelectedRegionPolygons = (
  polygonRefs: KakaoMapElement[],
) => {
  polygonRefs.forEach((polygon) => {
    polygon.setMap(null);
  });
  polygonRefs.length = 0;
};

const drawSelectedRegionPolygons = (
  map: KakaoMap,
  regionName: string,
  type: RentIndexMapOverlayType,
  polygonRefs: KakaoMapElement[],
) => {
  clearSelectedRegionPolygons(polygonRefs);

  const fillColor = getOverlayColor(type);

  (seoulGeoJson.features as DistrictGeoJsonFeature[]).forEach((feature) => {
    const guName = feature.properties.SIG_KOR_NM;

    if (regionMap[guName] !== regionName) return;

    const districtCenter = getCenterFromLngLatPoints(
      getGeoJsonLngLatPoints(feature.geometry as GeoJsonLngLatGeometry),
    );

    const polygons =
      feature.geometry.type === "Polygon"
        ? [feature.geometry.coordinates as number[][][]]
        : (feature.geometry.coordinates as number[][][][]);

    polygons.forEach((rings) => {
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

      polygonRefs.push(polygon);
    });

    if (!districtCenter) return;

    const labelOverlay = new window.kakao.maps.CustomOverlay({
      map,
      position: new window.kakao.maps.LatLng(
        districtCenter.lat,
        districtCenter.lng,
      ),
      zIndex: 6,
      yAnchor: 0.5,
      content: createDistrictNameLabelContent(guName, fillColor),
    });

    polygonRefs.push(labelOverlay);
  });
};

export const selectRentIndexItemOnMap = ({
  map,
  item,
  regionCenters,
  overlayRefs,
  selectedPolygonRefs,
}: SelectRentIndexItemParams) => {
  const region = getRegionName(item.name);
  const center = regionCenters.get(region);

  if (!center) return;

  drawSelectedRegionPolygons(map, region, item.type, selectedPolygonRefs);
  clearRentIndexOverlays(overlayRefs);
  map.panTo(new window.kakao.maps.LatLng(center.lat, center.lng));
};

export const drawRentIndexOverlays = ({
  map,
  items,
  regionCenters,
  overlayRefs,
  selectedPolygonRefs,
}: DrawRentIndexOverlaysParams) => {
  clearRentIndexOverlays(overlayRefs);

  items.forEach((item) => {
    const region = getRegionName(item.name);
    const center = regionCenters.get(region);

    if (!center) return;

    const color = getOverlayColor(item.type);
    const content = createRentIndexOverlayContent(item, color, () => {
      selectRentIndexItemOnMap({
        map,
        item,
        regionCenters,
        overlayRefs,
        selectedPolygonRefs,
      });
    });
    const overlay = new window.kakao.maps.CustomOverlay({
      map,
      position: new window.kakao.maps.LatLng(center.lat, center.lng),
      zIndex: 5,
      content,
    });

    overlayRefs.push(overlay);
  });
};
