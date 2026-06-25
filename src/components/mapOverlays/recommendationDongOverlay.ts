import type { MutableRefObject } from "react";
import seoulDongGeoJson from "@/assets/geojson/seoul_dong_geo.json";
import {
  createPolygonPaths,
  getCenterFromLngLatPoints,
  getGeoJsonLngLatPoints,
  type GeoJsonLngLatGeometry,
} from "@/components/mapOverlays/geoJson";

type KakaoMap = {
  setBounds: (bounds: unknown) => void;
};

type KakaoPolygon = {
  setMap: (map: KakaoMap | null) => void;
};

type KakaoOverlay = {
  setMap: (map: KakaoMap | null) => void;
};

type DongGeoJsonFeature = {
  properties: {
    COL_ADM_SE: string;
    EMD_NM: string;
  };
  geometry: GeoJsonLngLatGeometry;
};

type DrawRecommendationDongOverlayParams = {
  map: KakaoMap;
  neighborhoodName: string | null;
  districtCodeMap: globalThis.Map<string, string>;
  polygonRefs: KakaoPolygon[];
  labelRef: MutableRefObject<KakaoOverlay | null>;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const clearRecommendationDongOverlay = ({
  polygonRefs,
  labelRef,
}: Pick<DrawRecommendationDongOverlayParams, "polygonRefs" | "labelRef">) => {
  polygonRefs.forEach((polygon) => {
    polygon.setMap(null);
  });
  polygonRefs.length = 0;

  if (labelRef.current) {
    labelRef.current.setMap(null);
    labelRef.current = null;
  }
};

export const drawRecommendationDongOverlay = ({
  map,
  neighborhoodName,
  districtCodeMap,
  polygonRefs,
  labelRef,
}: DrawRecommendationDongOverlayParams) => {
  clearRecommendationDongOverlay({ polygonRefs, labelRef });

  if (!neighborhoodName) {
    return;
  }

  const nameParts = neighborhoodName.split(" ").filter(Boolean);
  const districtName = nameParts.at(-2) ?? "";
  const dongName = nameParts.at(-1) ?? "";
  const districtCode = districtCodeMap.get(districtName);

  if (!districtCode) {
    return;
  }

  const bounds = new window.kakao.maps.LatLngBounds();
  const lngLatPoints: number[][] = [];
  let hasPolygon = false;

  (seoulDongGeoJson.features as DongGeoJsonFeature[]).forEach((feature) => {
    const properties = feature.properties;

    if (
      properties.COL_ADM_SE !== districtCode ||
      properties.EMD_NM !== dongName
    ) {
      return;
    }

    const polygons =
      feature.geometry.type === "Polygon"
        ? [feature.geometry.coordinates as number[][][]]
        : (feature.geometry.coordinates as number[][][][]);

    polygons.forEach((rings) => {
      const polygon = new window.kakao.maps.Polygon({
        map,
        path: createPolygonPaths(rings),
        strokeWeight: 3,
        strokeColor: "#3385FF",
        strokeOpacity: 1,
        fillColor: "#3385FF",
        fillOpacity: 0.28,
        zIndex: 7,
      });

      const points = getGeoJsonLngLatPoints({
        type: "Polygon",
        coordinates: rings,
      });

      points.forEach(([lng, lat]) => {
        bounds.extend(new window.kakao.maps.LatLng(lat, lng));
      });
      lngLatPoints.push(...points);

      polygonRefs.push(polygon);
      hasPolygon = true;
    });
  });

  if (!hasPolygon) {
    return;
  }

  map.setBounds(bounds);
  const center = getCenterFromLngLatPoints(lngLatPoints);

  if (!center) {
    return;
  }

  labelRef.current = new window.kakao.maps.CustomOverlay({
    map,
    position: new window.kakao.maps.LatLng(center.lat, center.lng),
    zIndex: 8,
    yAnchor: 0.5,
    content: `
      <div style="
        min-width: 96px;
        padding: 8px 12px;
        border: 1px solid rgba(51, 133, 255, 0.28);
        border-radius: 8px;
        background: rgba(255,255,255,0.96);
        color: #1f2937;
        font-family: 'Pretendard', sans-serif;
        font-size: 13px;
        font-weight: 700;
        line-height: 1.25;
        text-align: center;
        box-shadow: 0 4px 14px rgba(15, 23, 42, 0.16);
        white-space: nowrap;
      ">
        <div style="color:#3385FF;font-size:12px;font-weight:700;">${escapeHtml(districtName)}</div>
        <div>${escapeHtml(dongName)}</div>
      </div>
    `,
  });
};
