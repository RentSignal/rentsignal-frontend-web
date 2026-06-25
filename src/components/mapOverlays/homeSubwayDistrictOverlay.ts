import seoulGeoJson from "@/assets/geojson/seoul-gu-simple.json";
import { createPolygonPaths } from "@/components/mapOverlays/geoJson";
import type { HomeSubwayRankingMapItem } from "@/store/mapOverlayStore";

type KakaoMap = {
  panTo: (position: unknown) => void;
  setLevel: (level: number) => void;
};

type KakaoPolygon = {
  setMap: (map: KakaoMap | null) => void;
};

type DistrictCenter = {
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

type DrawHomeSubwayDistrictOverlayParams = {
  map: KakaoMap;
  item: HomeSubwayRankingMapItem | null;
  districtCenters: globalThis.Map<string, DistrictCenter>;
  polygonRefs: KakaoPolygon[];
};

const getRegionName = (name: string) => {
  return name.split(" ").at(-1) ?? name;
};

export const clearHomeSubwayDistrictOverlay = (
  polygonRefs: KakaoPolygon[],
) => {
  polygonRefs.forEach((polygon) => {
    polygon.setMap(null);
  });
  polygonRefs.length = 0;
};

export const drawHomeSubwayDistrictOverlay = ({
  map,
  item,
  districtCenters,
  polygonRefs,
}: DrawHomeSubwayDistrictOverlayParams) => {
  clearHomeSubwayDistrictOverlay(polygonRefs);

  if (!item) {
    return;
  }

  const districtName = getRegionName(item.name);
  const center = districtCenters.get(districtName);
  const color = "#3385FF";

  if (!center) {
    return;
  }

  (seoulGeoJson.features as DistrictGeoJsonFeature[]).forEach((feature) => {
    if (feature.properties.SIG_KOR_NM !== districtName) {
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
        strokeColor: color,
        strokeOpacity: 1,
        fillColor: color,
        fillOpacity: 0.28,
        zIndex: 7,
      });

      polygonRefs.push(polygon);
    });
  });

  map.setLevel(6);
  map.panTo(new window.kakao.maps.LatLng(center.lat, center.lng));
};
