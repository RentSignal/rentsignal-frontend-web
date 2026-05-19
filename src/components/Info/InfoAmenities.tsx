import {
  ShoppingCart,
  Utensils,
  Hospital,
  Coffee,
  Pill,
  Store,
} from "lucide-react";
import { Fragment } from "react";

type AmenitiesProps = {
  title: string;
};

type AmenityItemProps = {
  title: string;
  description: string;
  qty: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
};

const amenities: AmenityItemProps[] = [
  {
    title: "대형마트",
    description: "대형 유통 매장 및 창고형 마트",
    qty: 3,
    icon: <ShoppingCart />,
    bgColor: "bg-[#FFF3F2]",
    textColor: "text-[#FF4242]",
  },
  {
    title: "음식점",
    description: "주변 식당 및 프랜차이즈 매장",
    qty: 12,
    icon: <Utensils />,
    bgColor: "bg-[#FFF7EC]",
    textColor: "text-[#FF8000]",
  },
  {
    title: "병원",
    description: "동네 병원, 의원 및 전문의원",
    qty: 5,
    icon: <Hospital />,
    bgColor: "bg-[#F7F7FF]",
    textColor: "text-[#A5AEE5]",
  },
  {
    title: "카페",
    description: "주변 카페 및 베이커리 디저트 매장",
    qty: 8,
    icon: <Coffee />,
    bgColor: "bg-[#FFFBF4]",
    textColor: "text-[#FF8000]",
  },
  {
    title: "약국",
    description: "처방 조제 및 일반 의약품 판매처",
    qty: 4,
    icon: <Pill />,
    bgColor: "bg-[#F9FBFA]",
    textColor: "text-[#9CDDD1]",
  },
  {
    title: "편의점",
    description: "주변 24시간 운영 편의점",
    qty: 6,
    icon: <Store />,
    bgColor: "bg-[#F5F8FA]",
    textColor: "text-[#A5C2D2]",
  },
];

const InfoAmenities = ({ title }: AmenitiesProps) => {
  return (
    <section className="px-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-coolNeutral-10">
          {title}의 편의시설 수
        </h2>
      </div>

      <AmenityList />
      <div className="h-[41px]"></div>
    </section>
  );
};

const AmenityItem = ({
  title,
  description,
  qty,
  icon,
  bgColor,
  textColor,
}: AmenityItemProps) => {
  return (
    <div className="flex items-center gap-[15px] bg-white px-[18px] py-[15px]">
      <div
        className={`flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-[10px] ${bgColor} ${textColor}`}
      >
        <div className="[&>svg]:h-[18px] [&>svg]:w-[18px] [&>svg]:stroke-[2]">
          {icon}
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="text-base font-semibold text-coolNeutral-25">
          {title}
        </div>
        <div className="text-xs text-coolNeutral-70">{description}</div>
      </div>

      <div className={`text-lg font-bold text-coolNeutral-25`}>{qty}</div>
    </div>
  );
};

const AmenityList = () => {
  return (
    <div className="flex flex-col">
      {amenities.map((amenity, index) => (
        <Fragment key={amenity.title}>
          <AmenityItem
            title={amenity.title}
            description={amenity.description}
            qty={amenity.qty}
            icon={amenity.icon}
            bgColor={amenity.bgColor}
            textColor={amenity.textColor}
          />

          {index !== amenities.length - 1 && (
            <div className="w-full h-px bg-coolNeutral-97" />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default InfoAmenities;
