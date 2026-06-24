import seoulGeoJson from "@/assets/geojson/seoul-gu-simple.json";
import seoulDongGeoJson from "@/assets/geojson/seoul_dong_geo.json";
import type { TodayRecommendation } from "@/services/homeApi";
import type { HomeGeoJsonGeometry } from "@/types/home";

const SEOUL_CENTER = { latitude: 37.5665, longitude: 126.978 };

const getGeoJsonPoints = (geometry: HomeGeoJsonGeometry) => {
  if (geometry.type === "Polygon") {
    return geometry.coordinates.flat();
  }

  return geometry.coordinates.flat(2);
};

const getCenterFromPoints = (points: number[][]) => {
  if (points.length === 0) {
    return SEOUL_CENTER;
  }

  const bounds = points.reduce(
    (acc, [longitude, latitude]) => ({
      minLatitude: Math.min(acc.minLatitude, latitude),
      maxLatitude: Math.max(acc.maxLatitude, latitude),
      minLongitude: Math.min(acc.minLongitude, longitude),
      maxLongitude: Math.max(acc.maxLongitude, longitude),
    }),
    {
      minLatitude: Number.POSITIVE_INFINITY,
      maxLatitude: Number.NEGATIVE_INFINITY,
      minLongitude: Number.POSITIVE_INFINITY,
      maxLongitude: Number.NEGATIVE_INFINITY,
    },
  );

  return {
    latitude: (bounds.minLatitude + bounds.maxLatitude) / 2,
    longitude: (bounds.minLongitude + bounds.maxLongitude) / 2,
  };
};

export const getNeighborhoodCenter = (neighborhoodName: string) => {
  const nameParts = neighborhoodName.split(" ").filter(Boolean);
  const districtName = nameParts.at(-2);
  const dongName = nameParts.at(-1);
  const district = seoulGeoJson.features.find(
    (feature) => feature.properties.SIG_KOR_NM === districtName,
  );
  const districtCode = district?.properties.SIG_CD;
  const neighborhood = seoulDongGeoJson.features.find(
    (feature) =>
      feature.properties.COL_ADM_SE === districtCode &&
      feature.properties.EMD_NM === dongName,
  );

  if (neighborhood) {
    return getCenterFromPoints(
      getGeoJsonPoints(neighborhood.geometry as HomeGeoJsonGeometry),
    );
  }

  if (district) {
    return getCenterFromPoints(
      getGeoJsonPoints(district.geometry as HomeGeoJsonGeometry),
    );
  }

  return SEOUL_CENTER;
};

export const getAccessibilityScore = (
  recommendation: TodayRecommendation,
) => {
  const facilities = Object.values(recommendation.facilityCount);
  const normalizedTotal = facilities.reduce(
    (total, facility) => total + facility.normalized,
    0,
  );

  return Math.round((normalizedTotal / facilities.length) * 100);
};

export const getDisplayNeighborhoodName = (neighborhoodName: string) =>
  neighborhoodName.replace(/^서울특별시\s*/, "");
