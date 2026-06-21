import seoulGeoJson from "@/assets/geojson/seoul-gu-simple.json";
import { regionMap } from "@/constants/regionMap";
import type { ConsumerIndexMapOverlayItem } from "@/store/mapOverlayStore";
import { getConsumerIndexPhase } from "@/utils/consumerIndexPhase";

type KakaoMap = object;
type KakaoOverlay = {
  setContent: (content: string) => void;
  setPosition: (position: unknown) => void;
  setMap: (map: KakaoMap | null) => void;
};
type KakaoPolygon = {
  setMap: (map: KakaoMap | null) => void;
  setOptions: (options: { fillOpacity: number }) => void;
};
type GeoJsonGeometry = {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
};
type GeoJsonFeature = {
  properties: {
    SIG_KOR_NM: string;
  };
  geometry: GeoJsonGeometry;
};
type MouseEvent = {
  latLng: unknown;
};

type DrawConsumerIndexPolygonsParams = {
  map: KakaoMap;
  item: ConsumerIndexMapOverlayItem | null;
  overlay: KakaoOverlay | null;
  createPolygonPaths: (rings: number[][][]) => unknown[];
  polygonRefs: KakaoPolygon[];
};

export const clearConsumerIndexPolygons = (polygonRefs: KakaoPolygon[]) => {
  polygonRefs.forEach((polygon) => {
    polygon.setMap(null);
  });
  polygonRefs.length = 0;
};

export const drawConsumerIndexPolygons = ({
  map,
  item,
  overlay,
  createPolygonPaths,
  polygonRefs,
}: DrawConsumerIndexPolygonsParams) => {
  clearConsumerIndexPolygons(polygonRefs);

  if (!item) return;

  const phase = getConsumerIndexPhase(item.value);
  const fillColor = phase.mapColor;

  (seoulGeoJson.features as GeoJsonFeature[]).forEach((feature) => {
    const { geometry, properties } = feature;
    const guName = properties.SIG_KOR_NM;
    const region = regionMap[guName];
    const polygons =
      geometry.type === "Polygon"
        ? [geometry.coordinates as number[][][]]
        : (geometry.coordinates as number[][][][]);

    polygons.forEach((rings: number[][][]) => {
      const polygon = new window.kakao.maps.Polygon({
        map,
        path: createPolygonPaths(rings),
        strokeWeight: 2,
        strokeColor: fillColor,
        strokeOpacity: 0.95,
        fillColor,
        fillOpacity: 0.3,
        zIndex: 3,
      });

      window.kakao.maps.event.addListener(
        polygon,
        "mouseover",
        (mouseEvent: MouseEvent) => {
          polygon.setOptions({
            fillOpacity: 0.52,
          });

          if (!overlay) return;

          overlay.setContent(`
            <div style="
              padding:8px 18px;
              background:white;
              text-align:center;
              border-radius:4px;
              font-size:13px;
              line-height:1.45;
              font-family:'Pretendard', sans-serif;
              box-shadow:0 2px 6px rgba(0,0,0,0.2);
            ">
              ${region}<br/>
              <strong>${guName}</strong><br/>
              현재 지수 ${item.value.toFixed(1)}점<br/>
              <span style="font-size:12px;color:#6B7280;">${item.year}년 ${item.month}월 기준</span><br/>
              <span style="color:${fillColor}; font-weight:700;">${phase.label}</span>
            </div>
          `);

          overlay.setPosition(mouseEvent.latLng);
          overlay.setMap(map);
        },
      );

      window.kakao.maps.event.addListener(polygon, "mouseout", () => {
        polygon.setOptions({
          fillOpacity: 0.3,
        });

        if (overlay) {
          overlay.setMap(null);
        }
      });

      polygonRefs.push(polygon);
    });
  });
};
