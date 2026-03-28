import RankingItem from "./RankingItem";

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

const RankingList = () => {
  return (
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
  );
};

export default RankingList;
