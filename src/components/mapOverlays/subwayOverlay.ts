import type {
  SubwayLinePolyline,
  SubwayStationMarker,
} from "@/store/mapOverlayStore";
import { getSubwayLineColor } from "@/utils/subwayLineStyle";

type KakaoMap = object;

type KakaoPolyline = {
  setMap: (map: KakaoMap | null) => void;
};

type KakaoMarker = {
  setMap: (map: KakaoMap | null) => void;
  setZIndex?: (zIndex: number) => void;
  __tooltipOverlay?: KakaoOverlay;
  __subwayStationMarker?: SubwayStationMarker;
};

type KakaoOverlay = {
  setMap: (map: KakaoMap | null) => void;
  setPosition?: (position: unknown) => void;
  setZIndex?: (zIndex: number) => void;
};

type DrawSubwayLinePolylinesParams = {
  map: KakaoMap;
  polylines: SubwayLinePolyline[];
  polylineRefs: KakaoPolyline[];
};

type DrawSubwayStationMarkersParams = {
  map: KakaoMap;
  markers: SubwayStationMarker[];
  markerRefs: KakaoMarker[];
};

type SelectSubwayStationMarkerOnMapParams = {
  map: KakaoMap;
  marker: SubwayStationMarker;
  markerRefs: KakaoMarker[];
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getSubwayStationMarkerImage = (color: string) => {
  const markerSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="10" fill="${color}" stroke="white" stroke-width="4"/>
      <circle cx="14" cy="14" r="4" fill="white"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markerSvg)}`;
};

const getSubwayStationTooltipContent = (
  stationName: string,
  lineName: string,
  color: string,
) => `
  <div
    style="
      position: relative;
      z-index: 2147483647;
      pointer-events: none;
      transform: translateY(-8px);
      padding: 9px 12px 10px;
      min-width: max-content;
      color: #111827;
      font-family: Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: rgba(255, 255, 255, 0.96);
      border: 1px solid rgba(17, 24, 39, 0.08);
      border-radius: 8px;
      box-shadow: 0 14px 34px rgba(15, 23, 42, 0.18), 0 2px 8px rgba(15, 23, 42, 0.10);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      white-space: nowrap;
    "
  >
    <div
      style="
        display: flex;
        align-items: center;
        gap: 7px;
        font-size: 13px;
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: 0;
      "
    >
      <span
        style="
          width: 8px;
          height: 8px;
          flex: 0 0 auto;
          border-radius: 999px;
          background: ${color};
          box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.06);
        "
      ></span>
      <span>${escapeHtml(stationName)}</span>
    </div>
    <div
      style="
        margin-top: 4px;
        padding-left: 15px;
        color: #6b7280;
        font-size: 11px;
        font-weight: 600;
        line-height: 1.2;
        letter-spacing: 0;
      "
    >
      ${escapeHtml(lineName)}
    </div>
    <div
      style="
        position: absolute;
        left: 50%;
        bottom: -6px;
        width: 12px;
        height: 12px;
        transform: translateX(-50%) rotate(45deg);
        background: rgba(255, 255, 255, 0.96);
        border-right: 1px solid rgba(17, 24, 39, 0.08);
        border-bottom: 1px solid rgba(17, 24, 39, 0.08);
      "
    ></div>
  </div>
`;

const isSameSubwayStationMarker = (
  left: SubwayStationMarker,
  right: SubwayStationMarker,
) =>
  left.stationName === right.stationName &&
  left.lineName === right.lineName &&
  left.latitude === right.latitude &&
  left.longitude === right.longitude;

const showSubwayStationTooltip = (marker: KakaoMarker, map: KakaoMap) => {
  marker.setZIndex?.(10001);
  marker.__tooltipOverlay?.setZIndex?.(10000);
  marker.__tooltipOverlay?.setMap(map);
};

const hideSubwayStationTooltip = (marker: KakaoMarker) => {
  marker.setZIndex?.(1000);
  marker.__tooltipOverlay?.setMap(null);
};

export const clearSubwayLinePolylines = (polylineRefs: KakaoPolyline[]) => {
  polylineRefs.forEach((polyline) => {
    polyline.setMap(null);
  });
  polylineRefs.length = 0;
};

export const clearSubwayStationMarkers = (markerRefs: KakaoMarker[]) => {
  markerRefs.forEach((marker) => {
    hideSubwayStationTooltip(marker);
    marker.setMap(null);
  });
  markerRefs.length = 0;
};

export const selectSubwayStationMarkerOnMap = ({
  map,
  marker,
  markerRefs,
}: SelectSubwayStationMarkerOnMapParams) => {
  markerRefs.forEach((markerRef) => {
    const stationMarker = markerRef.__subwayStationMarker;

    if (stationMarker && isSameSubwayStationMarker(stationMarker, marker)) {
      showSubwayStationTooltip(markerRef, map);
      return;
    }

    hideSubwayStationTooltip(markerRef);
  });
};

export const drawSubwayLinePolylines = ({
  map,
  polylines,
  polylineRefs,
}: DrawSubwayLinePolylinesParams) => {
  clearSubwayLinePolylines(polylineRefs);

  polylines.forEach((polyline) => {
    const path = polyline.path.map(
      (point) => new window.kakao.maps.LatLng(point.latitude, point.longitude),
    );

    const subwayLinePolyline = new window.kakao.maps.Polyline({
      map,
      path,
      strokeWeight: 5,
      strokeColor: polyline.color ?? getSubwayLineColor(polyline.lineName),
      strokeOpacity: 0.88,
      strokeStyle: "solid",
      zIndex: 8,
    });

    polylineRefs.push(subwayLinePolyline);
  });
};

export const drawSubwayStationMarkers = ({
  map,
  markers,
  markerRefs,
}: DrawSubwayStationMarkersParams) => {
  clearSubwayStationMarkers(markerRefs);

  markers.forEach((marker) => {
    const color = marker.color ?? getSubwayLineColor(marker.lineName);
    const position = new window.kakao.maps.LatLng(
      marker.latitude,
      marker.longitude,
    );
    const markerImage = new window.kakao.maps.MarkerImage(
      getSubwayStationMarkerImage(color),
      new window.kakao.maps.Size(28, 28),
      {
        offset: new window.kakao.maps.Point(14, 14),
      },
    );
    const subwayStationMarker = new window.kakao.maps.Marker({
      map,
      position,
      image: markerImage,
      zIndex: 1000,
    }) as KakaoMarker;
    const tooltipOverlay = new window.kakao.maps.CustomOverlay({
      position,
      content: getSubwayStationTooltipContent(
        marker.stationName,
        marker.lineName,
        color,
      ),
      xAnchor: 0.5,
      yAnchor: 1.25,
      zIndex: 10000,
    });

    window.kakao.maps.event.addListener(subwayStationMarker, "mouseover", () => {
      showSubwayStationTooltip(subwayStationMarker, map);
    });
    window.kakao.maps.event.addListener(subwayStationMarker, "mouseout", () => {
      hideSubwayStationTooltip(subwayStationMarker);
    });

    subwayStationMarker.__tooltipOverlay = tooltipOverlay;
    subwayStationMarker.__subwayStationMarker = marker;
    markerRefs.push(subwayStationMarker);
  });
};
