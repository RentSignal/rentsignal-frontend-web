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
  setZIndex?: (zIndex: number) => void;
  __tooltipOverlay?: KakaoOverlay;
};

type KakaoOverlay = {
  setMap: (map: KakaoMap | null) => void;
  setZIndex?: (zIndex: number) => void;
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

const getConvenienceTooltipContent = (name: string) => `
  <div
    style="
      position: relative;
      z-index: 2147483647;
      pointer-events: none;
      transform: translateY(-8px);
      padding: 9px 12px;
      min-width: max-content;
      max-width: 220px;
      color: #111827;
      font-family: Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: rgba(255, 255, 255, 0.96);
      border: 1px solid rgba(17, 24, 39, 0.08);
      border-radius: 8px;
      box-shadow: 0 14px 34px rgba(15, 23, 42, 0.18), 0 2px 8px rgba(15, 23, 42, 0.10);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 13px;
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: 0;
    "
  >
    ${escapeHtml(name)}
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

const showConvenienceTooltip = (marker: KakaoMarker, map: KakaoMap) => {
  marker.setZIndex?.(10001);
  marker.__tooltipOverlay?.setZIndex?.(10000);
  marker.__tooltipOverlay?.setMap(map);
};

const hideConvenienceTooltip = (marker: KakaoMarker) => {
  marker.setZIndex?.(0);
  marker.__tooltipOverlay?.setMap(null);
};

export const clearConvenienceMarkers = (markerRefs: KakaoMarker[]) => {
  markerRefs.forEach((marker) => {
    hideConvenienceTooltip(marker);
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
    }) as KakaoMarker;
    const tooltipOverlay = new window.kakao.maps.CustomOverlay({
      position,
      content: getConvenienceTooltipContent(pin.name),
      xAnchor: 0.5,
      yAnchor: 1.25,
      zIndex: 10000,
    });

    window.kakao.maps.event.addListener(marker, "mouseover", () => {
      showConvenienceTooltip(marker, map);
    });
    window.kakao.maps.event.addListener(marker, "mouseout", () => {
      hideConvenienceTooltip(marker);
    });

    marker.__tooltipOverlay = tooltipOverlay;
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
