import RestaurantIcon from "@/assets/icons/facilities/restaurant.svg?react";
import HospitalIcon from "@/assets/icons/facilities/Hospital.svg?react";
import CafeIcon from "@/assets/icons/facilities/cafe.svg?react";
import ParmacyIcon from "@/assets/icons/facilities/pharmacy.svg?react";
import TrafficIcon from "@/assets/icons/facilities/busfront_icon.svg?react";
import CctvIcon from "@/assets/icons/facilities/cctv.svg?react";
import ConvenienceIcon from "@/assets/icons/facilities/convenience_store.svg?react";
import Divider from "../Divider";

type Props = {
  open: boolean;
  onClose: () => void;
  data: any;
};

export default function RecommendationResultPanel({
  open,
  onClose,
  data,
}: Props) {
  return (
    <div
      className={`
        absolute right-0 top-0 h-full w-[377px]
        bg-white border-l border-divider_grey
        z-40
        overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <BodySection data={data} />
    </div>
  );
}

function BodySection({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className=" mt-3 gap-[5px]">
      <HeaderSection />
      <SelectedTag data={data} />
      <RecommendList data={data} />
    </div>
  );
}

function HeaderSection() {
  return (
    <div className="mt-[47px] px-6 py-3">
      <h2 className="text-[22px] font-semibold text-coolNeutral-25 ">
        이 동네는 어때요?
      </h2>
      <p className="text-base text-coolNeutral-50 pt-[7px]">
        조건에 맞는 동네를 우선순위에 따라 추천 드려요.
      </p>
    </div>
  );
}

function SelectedTag({ data }: { data: any }) {
  if (!data) return null;

  const tags = [data.houseType, data.rentType, data.priority].filter(Boolean);

  return (
    <div className="mx-6 flex flex-row gap-[8px] py-[19px]">
      {tags.map((tag, idx) => (
        <p
          key={idx}
          className="bg-blue-95 py-1 px-[10px] text-coolNeutral-30 text-[15px] font-medium rounded-lg"
        >
          # {tag}
        </p>
      ))}
    </div>
  );
}

function RecommendList({ data }: { data: any }) {
  const list = data?.recommendedNeighborhoods;

  if (!list?.length) return null;

  return (
    <>
      {list.map((item: any) => (
        <div key={item.rank}>
          <RecommendItemInfo item={item} />
          <RecommendFacilities data={item} />
          <StatItem item={item} />
          <PriceItem item={item} rentType={data.rentType} />
          <div className="mt-[38px] mb-[50px]">
            <Divider />
          </div>
        </div>
      ))}
    </>
  );
}

function RecommendItemInfo({ item }: { item: any }) {
  return (
    <div className="flex flex-row items-center justify-between mx-6 mb-3">
      <div className="gap-[10px] flex flex-row">
        <p className="text-sm font-bold text-white bg-blue-60 py-[4px] px-[8px] rounded-lg">
          Top {item.rank}
        </p>
        <p className="text-lg font-bold text-coolNeutral-25">{item.dongName}</p>
      </div>

      <div className="flex flex-col items-center">
        <p className="text-sm font-semibold text-coolNeutral-70">score</p>
        <p className="font-bold text-blue-60 text-[20px]">
          {item.score.toFixed(2)}
        </p>
      </div>
    </div>
  );
}

function RecommendFacilities({ data }: { data: any }) {
  if (!data) return null;

  const facility = data.facilityCount;

  return (
    <div className="mx-6 flex flex-col gap-[15px] ">
      {/* 음식점 */}
      <FacilityRow
        icon={<RestaurantIcon />}
        label="음식점"
        value={facility.restaurant.normalized}
      />

      {/* 병원 */}
      <FacilityRow
        icon={<HospitalIcon />}
        label="병원"
        value={facility.hospital.normalized}
      />

      {/* 카페 */}
      <FacilityRow
        icon={<CafeIcon />}
        label="카페"
        value={facility.cafe.normalized}
      />

      {/* 약국 */}
      <FacilityRow
        icon={<ParmacyIcon />}
        label="약국"
        value={facility.pharmacy.normalized}
      />

      {/* 마트 */}
      <FacilityRow
        icon={<ConvenienceIcon />}
        label="대형마트"
        value={facility.mart.normalized}
      />
      {/* <FacilityRow
        icon={<ConvenienceIcon />}
        label="편의점"
        value={facility.mart.normalized}
      /> */}
    </div>
  );
}

function FacilityRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  const percent = Math.round(value * 100);

  return (
    <div className="flex flex-col gap-[9px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 ml-1">
          {icon}
          <span className="text-sm font-medium text-coolNeutral-30">
            {label}
          </span>
        </div>

        <span className="text-sm font-medium text-coolNeutral-30">
          {percent}%
        </span>
      </div>

      <div className="w-full h-[6px] overflow-hidden rounded-full bg-coolNeutral-95 ">
        <div
          className="h-full rounded-full bg-blue-60"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function StatItem({ item }: { item: any }) {
  if (!item) return null;

  type SafetyLabel = "안전" | "보통" | "위험";

  const safetyMap: Record<SafetyLabel, string> = {
    안전: "text-[#66D575]",
    보통: "text-[#FF9000]",
    위험: "text-[#FF0000]",
  };

  const safetyLabel: SafetyLabel =
    item.safety >= 0.8 ? "안전" : item.safety >= 0.2 ? "보통" : "위험";

  return (
    <div className="flex flex-row gap-[53px] mb-[23px] mt-5 mx-7">
      {/* 교통 */}
      <div className="flex flex-row items-center gap-[15px]">
        <div className="flex flex-row items-center gap-[9px]">
          <TrafficIcon />
          <p className="text-sm font-medium text-coolNeutral-30">교통</p>
        </div>
        <p className="text-sm font-medium text-coolNeutral-25">
          {item.transport}
        </p>
      </div>
      {/* 치안 */}
      <div className="flex flex-row gap-[15px]">
        <div className="flex flex-row gap-[10px] ">
          <CctvIcon />
          <p className="text-sm font-medium text-coolNeutral-30">치안</p>
        </div>

        <p className={`text-sm font-medium ${safetyMap[safetyLabel]}`}>
          {safetyLabel}
        </p>
      </div>
    </div>
  );
}

function PriceItem({ item, rentType }: { item: any; rentType: string }) {
  if (!item) return null;

  const avgDeposit = rentType === "전세" ? item.avgDeposit : item.avgMonthly;

  return (
    <div className="bg-blue-99 pt-[11px] pb-[18px] px-5 mx-[24px] rounded-lg">
      <div className="flex flex-col gap-[10px]">
        <div className="flex flex-row items-center justify-between">
          <h2 className="font-semibold text-blue-60 text-[15px]">
            {rentType === "전세" ? "평균 전세가" : "평균 월세"}
          </h2>
          <h2 className="font-semibold text-coolNeutral-30 text-[13px]">
            반경 {item.distance}km
          </h2>
        </div>

        <h1 className="text-xl font-bold text-blue-20">
          {formatKoreanMoney(avgDeposit)}
        </h1>
      </div>
    </div>
  );
}

function formatKoreanMoney(value: number | null) {
  if (!value) return "-";

  const eok = Math.floor(value / 10000);
  const man = value % 10000;

  if (eok > 0) {
    return `${eok}억 ${man.toLocaleString()}만원`;
  }

  return `${man.toLocaleString()}만원`;
}
