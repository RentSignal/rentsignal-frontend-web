import seoulDongGeoJson from "@/assets/geojson/seoul_dong_geo.json";
import {
  createPolygonPaths,
  getGeoJsonLngLatPoints,
  type GeoJsonLngLatGeometry,
} from "@/components/mapOverlays/geoJson";

type KakaoMap = {
  setBounds: (bounds: unknown) => void;
};

type KakaoPolygon = {
  setMap: (map: KakaoMap | null) => void;
};

type DongGeoJsonFeature = {
  properties: {
    COL_ADM_SE: string;
    EMD_NM: string;
  };
  geometry: GeoJsonLngLatGeometry;
};

type DrawTransportDongOverlayParams = {
  map: KakaoMap;
  neighborhoodName: string | null;
  districtCodeMap: globalThis.Map<string, string>;
  polygonRefs: KakaoPolygon[];
};

const getTransportNeighborhoodParts = (name: string) => {
  const parts = name.split(" ").filter(Boolean);

  return {
    districtName: parts[0] ?? "",
    dongName: parts.at(-1) ?? name,
  };
};

export const clearTransportDongOverlay = (polygonRefs: KakaoPolygon[]) => {
  polygonRefs.forEach((polygon) => {
    polygon.setMap(null);
  });
  polygonRefs.length = 0;
};

export const drawTransportDongOverlay = ({
  map,
  neighborhoodName,
  districtCodeMap,
  polygonRefs,
}: DrawTransportDongOverlayParams) => {
  clearTransportDongOverlay(polygonRefs);

  if (!neighborhoodName) {
    return;
  }

  const { districtName, dongName } =
    getTransportNeighborhoodParts(neighborhoodName);
  const districtCode = districtCodeMap.get(districtName);

  if (!districtCode) {
    return;
  }

  const bounds = new window.kakao.maps.LatLngBounds();
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
        fillOpacity: 0.24,
        zIndex: 7,
      });

      getGeoJsonLngLatPoints({
        type: "Polygon",
        coordinates: rings,
      }).forEach(([lng, lat]) => {
        bounds.extend(new window.kakao.maps.LatLng(lat, lng));
      });

      polygonRefs.push(polygon);
      hasPolygon = true;
    });
  });

  if (hasPolygon) {
    map.setBounds(bounds);
  }
};
