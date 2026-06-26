import cafeMarkerUrl from "@/assets/icons/maker/cafe_marker.svg";
import convenienceMarkerUrl from "@/assets/icons/maker/conv_marker.svg";
import hospitalMarkerUrl from "@/assets/icons/maker/hospital_marker.svg";
import martMarkerUrl from "@/assets/icons/maker/mart_marker.svg";
import type {
  ConvenienceMapPin,
  ConvenienceMarkerType,
} from "@/store/mapOverlayStore";

type KakaoMap = {
  panTo: (position: unknown) => void;
  setBounds: (bounds: unknown) => void;
  setLevel: (level: number) => void;
};

type KakaoMarker = {
  setMap: (map: KakaoMap | null) => void;
};

type DrawConvenienceMarkersParams = {
  map: KakaoMap;
  pins: ConvenienceMapPin[];
  markerType: ConvenienceMarkerType | null;
  markerRefs: KakaoMarker[];
};

const convenienceMarkerImageMap: Record<ConvenienceMarkerType, string> = {
  mart: martMarkerUrl,
  convenienceStore: convenienceMarkerUrl,
  hospital: hospitalMarkerUrl,
  cafe: cafeMarkerUrl,
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const clearConvenienceMarkers = (markerRefs: KakaoMarker[]) => {
  markerRefs.forEach((marker) => {
    marker.setMap(null);
  });
  markerRefs.length = 0;
};

export const drawConvenienceMarkers = ({
  map,
  pins,
  markerType,
  markerRefs,
}: DrawConvenienceMarkersParams) => {
  clearConvenienceMarkers(markerRefs);

  if (pins.length === 0) {
    return;
  }

  const bounds = new window.kakao.maps.LatLngBounds();
  const markerImage = markerType
    ? new window.kakao.maps.MarkerImage(
        convenienceMarkerImageMap[markerType],
        new window.kakao.maps.Size(32, 32),
        {
          offset: new window.kakao.maps.Point(16, 16),
        },
      )
    : undefined;

  pins.forEach((pin) => {
    const position = new window.kakao.maps.LatLng(pin.latitude, pin.longitude);
    const marker = new window.kakao.maps.Marker({
      map,
      position,
      title: pin.name,
      image: markerImage,
    });

    const infoWindow = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:6px 10px;font-size:12px;white-space:nowrap;">${escapeHtml(pin.name)}</div>`,
    });

    window.kakao.maps.event.addListener(marker, "mouseover", () => {
      infoWindow.open(map, marker);
    });
    window.kakao.maps.event.addListener(marker, "mouseout", () => {
      infoWindow.close();
    });

    markerRefs.push(marker);
    bounds.extend(position);
  });

  if (pins.length === 1) {
    map.panTo(new window.kakao.maps.LatLng(pins[0].latitude, pins[0].longitude));
    map.setLevel(4);
    return;
  }

  map.setBounds(bounds);
};
