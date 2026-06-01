import {
  ShoppingCart,
  Utensils,
  Hospital,
  Coffee,
  Pill,
  Store,
} from "lucide-react";
import { Fragment } from "react";

export type InfoAmenityItem = {
  title: string;
  description: string;
  qty: number;
  type?: string;
};

type AmenitiesProps = {
  title: string;
  items: InfoAmenityItem[];
};

type AmenityItemProps = InfoAmenityItem & {
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
};

const amenityStyleMap: Record<
  string,
  { icon: React.ReactNode; bgColor: string; textColor: string }
> = {
  대형마트: {
    icon: <ShoppingCart />,
    bgColor: "bg-[#FFF3F2]",
    textColor: "text-[#FF4242]",
  },
  음식점: {
    icon: <Utensils />,
    bgColor: "bg-[#FFF7EC]",
    textColor: "text-[#FF8000]",
  },
  병원: {
    icon: <Hospital />,
    bgColor: "bg-[#F7F7FF]",
    textColor: "text-[#A5AEE5]",
  },
  카페: {
    icon: <Coffee />,
    bgColor: "bg-[#FFFBF4]",
    textColor: "text-[#FF8000]",
  },
  약국: {
    icon: <Pill />,
    bgColor: "bg-[#F9FBFA]",
    textColor: "text-[#9CDDD1]",
  },
  편의점: {
    icon: <Store />,
    bgColor: "bg-[#F5F8FA]",
    textColor: "text-[#A5C2D2]",
  },
};

const defaultAmenityStyle = amenityStyleMap["편의점"];

const InfoAmenities = ({ title, items }: AmenitiesProps) => {
  return (
    <section className="px-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-coolNeutral-10">
          {title}의 편의시설 수
        </h2>
      </div>

      <AmenityList items={items} />
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

const AmenityList = ({ items }: { items: InfoAmenityItem[] }) => {
  return (
    <div className="flex flex-col">
      {items.map((amenity, index) => {
        const style =
          amenityStyleMap[amenity.type ?? amenity.title] ?? defaultAmenityStyle;

        return (
          <Fragment key={amenity.type ?? amenity.title}>
            <AmenityItem
              title={amenity.title}
              description={amenity.description}
              qty={amenity.qty}
              type={amenity.type}
              icon={style.icon}
              bgColor={style.bgColor}
              textColor={style.textColor}
            />

            {index !== items.length - 1 && (
              <div className="w-full h-px bg-coolNeutral-97" />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default InfoAmenities;
