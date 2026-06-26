import type { SubwayIndexMapOverlayItem } from "@/store/mapOverlayStore";

type KakaoMap = object;

type KakaoOverlay = {
  setMap: (map: KakaoMap | null) => void;
};

type DistrictCenter = {
  lat: number;
  lng: number;
};

type DrawSubwayIndexOverlaysParams = {
  map: KakaoMap;
  items: SubwayIndexMapOverlayItem[];
  districtCenters: globalThis.Map<string, DistrictCenter>;
  overlayRefs: KakaoOverlay[];
};

const getRegionName = (name: string) => {
  return name.split(" ").at(-1) ?? name;
};

const getSubwayIndexOverlayColor = (value: number) => {
  if (value >= 100.8) return "#FF0000";
  if (value >= 100.6) return "#FF8000";
  if (value >= 100.4) return "#66D575";
  return "#005EFF";
};

const createSubwayIndexOverlayContent = (
  item: SubwayIndexMapOverlayItem,
  color: string,
) => {
  const container = document.createElement("div");
  container.style.width = "97px";
  container.style.height = "73px";
  container.style.background = color;
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.color = "white";
  container.style.fontFamily = "'Pretendard', sans-serif";
  container.style.fontWeight = "700";
  container.style.boxShadow = "0 3px 8px rgba(0,0,0,0.16)";
  container.style.textShadow = "0 1px 2px rgba(0,0,0,0.2)";

  const name = document.createElement("div");
  name.style.fontSize = "15px";
  name.style.fontWeight = "700";
  name.style.lineHeight = "1.2";
  name.textContent = getRegionName(item.name);

  const value = document.createElement("div");
  value.style.fontSize = "15px";
  value.style.fontWeight = "700";
  value.style.lineHeight = "1.2";
  value.textContent = `${item.value.toFixed(1)}점`;

  container.append(name, value);

  return container;
};

export const clearSubwayIndexOverlays = (overlayRefs: KakaoOverlay[]) => {
  overlayRefs.forEach((overlay) => {
    overlay.setMap(null);
  });
  overlayRefs.length = 0;
};

export const drawSubwayIndexOverlays = ({
  map,
  items,
  districtCenters,
  overlayRefs,
}: DrawSubwayIndexOverlaysParams) => {
  clearSubwayIndexOverlays(overlayRefs);

  items.forEach((item) => {
    const district = getRegionName(item.name);
    const center = districtCenters.get(district);

    if (!center) return;

    const overlay = new window.kakao.maps.CustomOverlay({
      map,
      position: new window.kakao.maps.LatLng(center.lat, center.lng),
      zIndex: 6,
      content: createSubwayIndexOverlayContent(
        item,
        getSubwayIndexOverlayColor(item.value),
      ),
    });

    overlayRefs.push(overlay);
  });
};
