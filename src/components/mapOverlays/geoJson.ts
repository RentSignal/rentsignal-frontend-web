export type GeoJsonLngLatGeometry = {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
};

export const getGeoJsonLngLatPoints = (geometry: GeoJsonLngLatGeometry) => {
  const points: number[][] = [];

  if (geometry.type === "Polygon") {
    geometry.coordinates.forEach((ring) => {
      points.push(...(ring as number[][]));
    });
  }

  if (geometry.type === "MultiPolygon") {
    geometry.coordinates.forEach((polygon) => {
      (polygon as number[][][]).forEach((ring) => {
        points.push(...ring);
      });
    });
  }

  return points;
};

export const getCenterFromLngLatPoints = (points: number[][]) => {
  if (points.length === 0) return null;

  const bounds = points.reduce(
    (
      acc: {
        minLat: number;
        maxLat: number;
        minLng: number;
        maxLng: number;
      },
      [lng, lat],
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

export const createPolygonPaths = (rings: number[][][]) => {
  return rings.map((ring) =>
    ring.map(([lng, lat]) => new window.kakao.maps.LatLng(lat, lng)),
  );
};
