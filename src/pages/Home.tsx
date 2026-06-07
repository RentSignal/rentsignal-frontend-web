import { useEffect, useRef, useState } from "react";
import RisingIcon from "@/assets/icons/home/home_rising.png";
import RecommendationIcon from "@/assets/icons/home/home_recommendation.png";
import LineChartIcon from "@/assets/icons/home/home_linechart.png";
import ReviewIcon from "@/assets/icons/home/home_review.png";
import RightArrow from "@/assets/icons/home/recommendation_right_arrow.svg?react";
import LocationIcon from "@/assets/icons/home/location_pin.svg?react";
import seoulGeoJson from "@/assets/geojson/seoul-gu-simple.json";
import seoulDongGeoJson from "@/assets/geojson/seoul_dong_geo.json";
import {
  fetchTodayRecommendations,
  type TodayRecommendation,
} from "@/services/homeApi";

declare global {
  interface Window {
    kakao: any;
  }
}

const KAKAO_SDK_ID = "kakao-map-sdk";
const SEOUL_CENTER = { latitude: 37.5665, longitude: 126.978 };

const getGeoJsonPoints = (geometry: any) => {
  if (geometry.type === "Polygon") {
    return geometry.coordinates.flat();
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.flat(2);
  }

  return [];
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

const getNeighborhoodCenter = (neighborhoodName: string) => {
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
    return getCenterFromPoints(getGeoJsonPoints(neighborhood.geometry));
  }

  if (district) {
    return getCenterFromPoints(getGeoJsonPoints(district.geometry));
  }

  return SEOUL_CENTER;
};

const getAccessibilityScore = (recommendation: TodayRecommendation) => {
  const facilities = Object.values(recommendation.facilityCount);
  const normalizedTotal = facilities.reduce(
    (total, facility) => total + facility.normalized,
    0,
  );

  return Math.round((normalizedTotal / facilities.length) * 100);
};

const getDisplayNeighborhoodName = (neighborhoodName: string) =>
  neighborhoodName.replace(/^서울특별시\s*/, "");

const loadKakaoSdk = () =>
  new Promise<void>((resolve) => {
    if (window.kakao?.maps) {
      window.kakao.maps.load(() => resolve());
      return;
    }

    const existingScript = document.getElementById(KAKAO_SDK_ID);

    if (existingScript) {
      const intervalId = window.setInterval(() => {
        if (!window.kakao?.maps) {
          return;
        }

        window.clearInterval(intervalId);
        window.kakao.maps.load(() => resolve());
      }, 50);
      return;
    }

    const script = document.createElement("script");
    script.id = KAKAO_SDK_ID;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_JS_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      if (!window.kakao?.maps) {
        resolve();
        return;
      }

      window.kakao.maps.load(() => resolve());
    };

    document.head.appendChild(script);
  });

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <HeaderSection />
      <RecommendationList />
      <SubwayList />
    </div>
  );
};

export default Home;

type IconButtonProps = {
  icon: string;
  label: string;
  iconWidth: string;
  iconHeight: string;
};

function IconButton({ icon, label, iconWidth, iconHeight }: IconButtonProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[54px] h-[52px] bg-blue-95 border border-blue-99 rounded-[14px] mb-[10px]">
        <img
          src={icon}
          alt={label}
          className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
          style={{
            width: iconWidth + "px",
            height: iconHeight + "px",
          }}
        />
      </div>
      <h4 className="w-[76px] whitespace-normal break-keep text-center text-xs font-semibold leading-[16px]">
        {label}
      </h4>
    </div>
  );
}

type RecommendationCardProps = {
  neighborhoodName: string;
  accessibilityScore: number;
  transportScore: number;
  latitude: number;
  longitude: number;
};

function RecommendationCard({
  neighborhoodName,
  accessibilityScore,
  transportScore,
  latitude,
  longitude,
}: RecommendationCardProps) {
  return (
    <div className="h-[92px] w-[129px] shrink-0 overflow-hidden rounded-[12px] bg-coolNeutral-99">
      <RecommendationMap latitude={latitude} longitude={longitude} />

      <div className="px-[10px] pb-[8px] pt-[7px]">
        <div className="mb-[4px] flex items-center gap-[4px]">
          <LocationIcon className="h-[8px] w-[8px] shrink-0" />

          <h2 className="truncate text-[10px] font-semibold leading-[12px] text-black">
            {neighborhoodName}
          </h2>
        </div>

        <p className="truncate text-[8px] font-bold leading-[10px] text-coolNeutral-50">
          접근성: {accessibilityScore} / 교통: {transportScore}
        </p>
      </div>
    </div>
  );
}

type RecommendationMapProps = {
  latitude: number;
  longitude: number;
};

function RecommendationMap({ latitude, longitude }: RecommendationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let overlay: any = null;
    let isMounted = true;

    const initMap = async () => {
      await loadKakaoSdk();

      if (!isMounted || !mapRef.current || !window.kakao?.maps) {
        return;
      }

      const center = new window.kakao.maps.LatLng(latitude, longitude);

      const map = new window.kakao.maps.Map(mapRef.current, {
        center,
        level: 5,
      });

      map.setDraggable(false);
      map.setZoomable(false);

      const markerElement = document.createElement("div");
      markerElement.className =
        "h-[12px] w-[12px] rounded-full border-[2px] border-white bg-blue-60 ";

      overlay = new window.kakao.maps.CustomOverlay({
        position: center,
        content: markerElement,
        yAnchor: 0.5,
        xAnchor: 0.5,
      });

      overlay.setMap(map);
    };

    initMap();

    return () => {
      isMounted = false;

      if (overlay) {
        overlay.setMap(null);
      }
    };
  }, [latitude, longitude]);

  return <div ref={mapRef} className="h-[52px] w-full bg-slate-100" />;
}
function RecommendationList() {
  const [recommendations, setRecommendations] = useState<
    TodayRecommendation[]
  >([]);

  useEffect(() => {
    let isMounted = true;

    const loadRecommendations = async () => {
      try {
        const data = await fetchTodayRecommendations();

        if (isMounted) {
          setRecommendations(data);
        }
      } catch {
        if (isMounted) {
          setRecommendations([]);
        }
      }
    };

    loadRecommendations();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="flex w-full min-w-0 flex-col gap-[14px]">
      <div className="flex items-center justify-between px-[24px]">
        <h3 className="text-[15px] font-semibold">오늘의 추천 지역</h3>
        <RightArrow />
      </div>

      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex w-max gap-4 px-[24px]">
          {recommendations.map((recommendation) => {
            const { latitude, longitude } = getNeighborhoodCenter(
              recommendation.dongName,
            );

            return (
              <RecommendationCard
                key={`${recommendation.dongName}-${recommendation.rank}`}
                neighborhoodName={getDisplayNeighborhoodName(
                  recommendation.dongName,
                )}
                accessibilityScore={getAccessibilityScore(recommendation)}
                transportScore={recommendation.transport}
                latitude={latitude}
                longitude={longitude}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HeaderSection() {
  return (
    <div className="flex  justify-between  px-5 mt-4 mb-[30px]">
      <IconButton
        icon={RisingIcon}
        label="급상승 지역"
        iconWidth="30"
        iconHeight="42"
      />
      <IconButton
        icon={RecommendationIcon}
        label="AI 추천 지역"
        iconWidth="30"
        iconHeight="42"
      />
      <IconButton
        icon={LineChartIcon}
        label="전월세 통합지수"
        iconWidth="36"
        iconHeight="30"
      />
      <IconButton
        icon={ReviewIcon}
        label="거주 리뷰"
        iconWidth="28"
        iconHeight="28"
      />
    </div>
  );
}

function SubwayList() {
  return (
    <>
      <div className="flex items-center justify-between px-[24px] mt-[50px]">
        <h3 className="text-[15px] font-semibold mb-[22px]">
          지하철 접근성이 높은 지역 TOP5
        </h3>
      </div>
      {subwayItems.map((item) => (
        <SubwayItem
          key={item.rank}
          rank={item.rank}
          name={item.name}
          value={item.value}
        />
      ))}
    </>
  );
}

type SubwayItemProps = {
  rank: number;
  name: string;
  value: number;
};

const subwayItems = [
  { rank: 1, name: "양천구", value: 100.5 },
  { rank: 1, name: "양천구", value: 100.5 },
  { rank: 1, name: "양천구", value: 100.5 },
];

function SubwayItem({ rank, name, value }: SubwayItemProps) {
  return (
    <>
      <div className="flex justify-between px-[36px] py-[5px] mb-[11px]">
        <h4 className="text-base font-medium text-coolNeutral-50">{rank}</h4>
        <h4 className="text-base font-medium text-coolNeutral-50">{name}</h4>
        <h4 className="text-base font-medium text-blue-50">{value}점</h4>
      </div>
    </>
  );
}
