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

export const clearSubwayLinePolylines = (polylineRefs: KakaoPolyline[]) => {
  polylineRefs.forEach((polyline) => {
    polyline.setMap(null);
  });
  polylineRefs.length = 0;
};

export const clearSubwayStationMarkers = (markerRefs: KakaoMarker[]) => {
  markerRefs.forEach((marker) => {
    marker.setMap(null);
  });
  markerRefs.length = 0;
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
      title: marker.stationName,
      image: markerImage,
      zIndex: 9,
    });
    const infoWindow = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:6px 10px;font-size:12px;white-space:nowrap;">${escapeHtml(marker.stationName)} · ${escapeHtml(marker.lineName)}</div>`,
    });

    window.kakao.maps.event.addListener(subwayStationMarker, "mouseover", () => {
      infoWindow.open(map, subwayStationMarker);
    });
    window.kakao.maps.event.addListener(subwayStationMarker, "mouseout", () => {
      infoWindow.close();
    });

    markerRefs.push(subwayStationMarker);
  });
};
