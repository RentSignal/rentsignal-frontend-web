import type {
  DistrictSubwayStation,
  SubwayAccessibilityRanking,
} from "@/services/homeApi";

export type IconButtonProps = {
  icon: string;
  label: string;
  iconWidth: string;
  iconHeight: string;
  onClick?: () => void;
};

export type RecommendationCardProps = {
  neighborhoodName: string;
  accessibilityScore: number;
  transportScore: number;
  latitude: number;
  longitude: number;
  onClick: () => void;
};

export type RecommendationMapProps = {
  latitude: number;
  longitude: number;
};

export type SubwayRankingWithDetails = SubwayAccessibilityRanking & {
  subwayLines: string[];
  subwayStations: DistrictSubwayStation[];
};

export type SubwayItemProps = {
  rank: number;
  name: string;
  value: number;
  subwayLines: string[];
  onClick: () => void;
};

export type SubwayLineBadgeProps = {
  lineName: string;
};

export type HomeGeoJsonGeometry =
  | {
      type: "Polygon";
      coordinates: number[][][];
    }
  | {
      type: "MultiPolygon";
      coordinates: number[][][][];
    };

export type KakaoMap = {
  setDraggable: (draggable: boolean) => void;
  setZoomable: (zoomable: boolean) => void;
};

export type KakaoCustomOverlay = {
  setMap: (map: KakaoMap | null) => void;
};

export type KakaoMapsApi = {
  load: (callback: () => void) => void;
  LatLng: new (latitude: number, longitude: number) => unknown;
  Map: new (
    container: HTMLDivElement,
    options: { center: unknown; level: number },
  ) => KakaoMap;
  CustomOverlay: new (options: {
    position: unknown;
    content: HTMLElement;
    yAnchor: number;
    xAnchor: number;
  }) => KakaoCustomOverlay;
};

export type ResidenceReviewItem = {
  id: number;
  title: string;
  content: string;
  category: string;
  userId: number;
  userName: string;
  neighborhoodName: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
};
