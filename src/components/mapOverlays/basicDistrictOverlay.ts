import seoulGeoJson from "@/assets/geojson/seoul-gu-simple.json";
import { regionMap } from "@/constants/regionMap";
import { regionColor, regionBoundaryColor } from "@/constants/regionColor";
import { createPolygonPaths } from "@/components/mapOverlays/geoJson";

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

type DistrictGeoJsonFeature = {
  properties: {
    SIG_KOR_NM: string;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
};

type MouseEvent = {
  latLng: unknown;
};

type DrawBasicDistrictPolygonsParams = {
  map: KakaoMap;
  overlay: KakaoOverlay | null;
  enableOverlay: boolean;
  polygonRefs: KakaoPolygon[];
};

const createBasicDistrictPolygon = ({
  map,
  rings,
  properties,
  overlay,
  enableOverlay,
  polygonRefs,
}: DrawBasicDistrictPolygonsParams & {
  rings: number[][][];
  properties: DistrictGeoJsonFeature["properties"];
}) => {
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

  polygonRefs.push(polygon);

  window.kakao.maps.event.addListener(
    polygon,
    "mouseover",
    (mouseEvent: MouseEvent) => {
      polygon.setOptions({
        fillOpacity: 0.9,
      });

      if (!overlay || !enableOverlay) return;

      overlay.setContent(`
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

      overlay.setPosition(mouseEvent.latLng);
      overlay.setMap(map);
    },
  );

  window.kakao.maps.event.addListener(polygon, "mouseout", () => {
    polygon.setOptions({
      fillOpacity: 0.6,
    });

    if (overlay) {
      overlay.setMap(null);
    }
  });
};

export const clearBasicDistrictPolygons = (polygonRefs: KakaoPolygon[]) => {
  polygonRefs.forEach((polygon) => {
    polygon.setMap(null);
  });
  polygonRefs.length = 0;
};

export const drawBasicDistrictPolygons = ({
  map,
  overlay,
  enableOverlay,
  polygonRefs,
}: DrawBasicDistrictPolygonsParams) => {
  (seoulGeoJson.features as DistrictGeoJsonFeature[]).forEach((feature) => {
    const { geometry, properties } = feature;

    if (geometry.type === "Polygon") {
      createBasicDistrictPolygon({
        map,
        rings: geometry.coordinates as number[][][],
        properties,
        overlay,
        enableOverlay,
        polygonRefs,
      });
    }

    if (geometry.type === "MultiPolygon") {
      (geometry.coordinates as number[][][][]).forEach((rings) => {
        createBasicDistrictPolygon({
          map,
          rings,
          properties,
          overlay,
          enableOverlay,
          polygonRefs,
        });
      });
    }
  });
};
