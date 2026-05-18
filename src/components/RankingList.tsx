import { useState } from "react";
import RankingItem from "./RankingItem";
import DropDown from "./DropDown";

// TODO: Dummy data -> Fetch list로 바꿔야함
const data = [
  { rank: 1, name: "강남 서남권", value: 5.31 },
  { rank: 2, name: "강북 도심권", value: 5.31 },
  { rank: 3, name: "강북 동북권", value: 5.31 },
  { rank: 4, name: "강북 동북권", value: 5.31 },
  { rank: 5, name: "강북 동북권", value: 5.31 },
  { rank: 6, name: "강북 동북권", value: 5.31 },
  { rank: 7, name: "강북 동북권", value: 5.31 },
];

const dropdownItems = [{ value: "seoul", label: "서울특별시" }];

type RankingListProps = {
  title: string;
  showDropDown?: boolean;
};

const RankingList = ({ title, showDropDown = true }: RankingListProps) => {
  const [value, setValue] = useState("seoul");

  return (
    <div className="flex flex-col gap-[16px] items-start">
      <div className="pl-5 flex flex-col gap-[16px] items-start">
        <h2 className="text-xl font-semibold text-coolNeutral-10">{title}</h2>
        {showDropDown && (
          <DropDown
            items={dropdownItems}
            value={value}
            onChange={setValue}
            placeholder="지역 선택"
          />
        )}
      </div>
      <div className="w-full bg-white">
        {data.map((item) => (
          <RankingItem
            key={item.rank}
            rank={item.rank}
            name={item.name}
            value={item.value}
          />
        ))}
      </div>
    </div>
  );
};

export default RankingList;
