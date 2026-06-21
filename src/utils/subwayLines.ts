import metroLineData from "@/constants/data-metro-line-1.0.0.json";
import type {
  SubwayLinePathPoint,
  SubwayLinePolyline,
  SubwayStationMarker,
} from "@/store/mapOverlayStore";

type NearbySubwayStation = {
  stationName: string;
  lineName?: string;
};

type MetroStation = {
  line?: string;
  name: string;
  lat: number;
  lng: number;
};

type MetroNode = {
  station?: MetroStation[];
  via?: number[][];
};

type MetroLine = {
  line: string;
  line_name: string;
  line_subname: string;
  color: string;
  node: MetroNode[];
};

type MetroLineJson = {
  DATA: MetroLine[];
};

type OrderedStation = {
  station: MetroStation;
  pathIndex: number;
};

type MatchedStation = OrderedStation & {
  nearbyStation: NearbySubwayStation;
};

type SubwayLineOverlayData = {
  polylines: SubwayLinePolyline[];
  stationMarkers: SubwayStationMarker[];
};

const metroLines = (metroLineData as unknown as MetroLineJson).DATA;

const normalizeStationName = (name: string) =>
  name.trim().replace(/\s+/g, "").replace(/역$/, "");

const normalizeLineName = (name: string) => name.trim().replace(/\s+/g, "");

const getLineNumberLabel = (lineName: string) => {
  const match = lineName.match(/\d+/);

  return match?.[0] ?? "";
};

const getStationNameCandidates = (name: string) => {
  const parenthesizedNames = Array.from(name.matchAll(/\(([^)]+)\)/g)).map(
    (match) => match[1] ?? "",
  );
  const nameWithoutParentheses = name.replace(/\([^)]*\)/g, "");

  return new Set(
    [name, nameWithoutParentheses, ...parenthesizedNames]
      .filter(Boolean)
      .map(normalizeStationName),
  );
};

const getLineNameCandidates = (name: string) => {
  const lineNumberLabel = getLineNumberLabel(name);
  const candidates = [name];

  if (lineNumberLabel.length > 0) {
    candidates.push(lineNumberLabel, `${lineNumberLabel}호선`);
  }

  return new Set(candidates.filter(Boolean).map(normalizeLineName));
};

const getMetroLineAliases = (line: MetroLine) => {
  const stationLineNames = line.node.flatMap((node) =>
    (node.station ?? []).map((station) => station.line ?? ""),
  );

  return new Set(
    [line.line, line.line_name, line.line_subname, ...stationLineNames]
      .filter(Boolean)
      .flatMap((name) => Array.from(getLineNameCandidates(name))),
  );
};

const matchesLineName = (line: MetroLine, lineName?: string) => {
  if (!lineName) {
    return true;
  }

  const lineAliases = getMetroLineAliases(line);

  return Array.from(getLineNameCandidates(lineName)).some((candidate) =>
    lineAliases.has(candidate),
  );
};

const matchesStationName = (
  nearbyStation: NearbySubwayStation,
  station: MetroStation,
) =>
  getStationNameCandidates(nearbyStation.stationName).has(
    normalizeStationName(station.name),
  );

const getNodePathPoints = (node: MetroNode) => {
  const pathPoints =
    node.via && node.via.length > 0
      ? node.via.map(([latitude, longitude]) => ({ latitude, longitude }))
      : (node.station ?? []).map((station) => ({
          latitude: station.lat,
          longitude: station.lng,
        }));

  return pathPoints.filter(
    (point) =>
      Number.isFinite(point.latitude) && Number.isFinite(point.longitude),
  );
};

const isSamePoint = (
  firstPoint: SubwayLinePathPoint,
  secondPoint: SubwayLinePathPoint,
) =>
  firstPoint.latitude === secondPoint.latitude &&
  firstPoint.longitude === secondPoint.longitude;

const findPathIndex = (
  path: SubwayLinePathPoint[],
  station: MetroStation,
) => {
  const stationPoint = {
    latitude: station.lat,
    longitude: station.lng,
  };

  return path.findIndex((point) => isSamePoint(point, stationPoint));
};

const getLinePathData = (line: MetroLine) => {
  const path: SubwayLinePathPoint[] = [];
  const orderedStations: OrderedStation[] = [];
  const seenStationKeys = new Set<string>();

  line.node.forEach((node) => {
    getNodePathPoints(node).forEach((point) => {
      const lastPoint = path.at(-1);

      if (!lastPoint || !isSamePoint(lastPoint, point)) {
        path.push(point);
      }
    });

    (node.station ?? []).forEach((station) => {
      const stationKey = `${normalizeStationName(station.name)}-${station.lat}-${station.lng}`;

      if (seenStationKeys.has(stationKey)) {
        return;
      }

      const pathIndex = findPathIndex(path, station);

      if (pathIndex < 0) {
        return;
      }

      seenStationKeys.add(stationKey);
      orderedStations.push({ station, pathIndex });
    });
  });

  return { path, orderedStations };
};

const getMatchedStationsInLine = (
  line: MetroLine,
  nearbyStations: NearbySubwayStation[],
) => {
  const { path, orderedStations } = getLinePathData(line);

  return {
    path,
    stations: orderedStations.reduce<MatchedStation[]>(
      (matchedStations, orderedStation) => {
        const nearbyStation = nearbyStations.find((station) => {
          if (!matchesLineName(line, station.lineName)) {
            return false;
          }

          return matchesStationName(station, orderedStation.station);
        });

        if (!nearbyStation) {
          return matchedStations;
        }

        return [...matchedStations, { ...orderedStation, nearbyStation }];
      },
      [],
    ),
  };
};

const getSegmentPath = (
  path: SubwayLinePathPoint[],
  startIndex: number,
  endIndex: number,
) => {
  if (startIndex === endIndex) {
    return [];
  }

  const [fromIndex, toIndex] =
    startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];

  return path.slice(fromIndex, toIndex + 1);
};

const getUniqueMarkers = (markers: SubwayStationMarker[]) => {
  const seenMarkers = new Set<string>();

  return markers.filter((marker) => {
    const markerKey = `${marker.lineName}-${marker.stationName}-${marker.latitude}-${marker.longitude}`;

    if (seenMarkers.has(markerKey)) {
      return false;
    }

    seenMarkers.add(markerKey);

    return true;
  });
};

export const getSubwayLineOverlayData = (
  nearbyStations: NearbySubwayStation[],
): SubwayLineOverlayData => {
  if (nearbyStations.length === 0) {
    return { polylines: [], stationMarkers: [] };
  }

  const polylines: SubwayLinePolyline[] = [];
  const stationMarkers: SubwayStationMarker[] = [];

  metroLines.forEach((line) => {
    const { path, stations } = getMatchedStationsInLine(line, nearbyStations);
    const sortedStations = [...stations].sort(
      (firstStation, secondStation) =>
        firstStation.pathIndex - secondStation.pathIndex,
    );

    sortedStations.forEach(({ station, nearbyStation }) => {
      stationMarkers.push({
        stationName: station.name,
        lineName: line.line_subname || line.line,
        sourceStationName: nearbyStation.stationName,
        sourceLineName: nearbyStation.lineName,
        latitude: station.lat,
        longitude: station.lng,
        color: line.color,
      });
    });

    for (let index = 0; index < sortedStations.length - 1; index += 1) {
      const currentStation = sortedStations[index];
      const nextStation = sortedStations[index + 1];

      if (!currentStation || !nextStation) {
        continue;
      }

      const segmentPath = getSegmentPath(
        path,
        currentStation.pathIndex,
        nextStation.pathIndex,
      );

      if (segmentPath.length < 2) {
        continue;
      }

      polylines.push({
        lineName: line.line_subname || line.line,
        color: line.color,
        path: segmentPath,
      });
    }
  });

  return {
    polylines,
    stationMarkers: getUniqueMarkers(stationMarkers),
  };
};
