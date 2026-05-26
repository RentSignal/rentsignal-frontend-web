import Divider from "../Divider";
import IndexSectionHeader, { IndexState } from "./section/InfoSectionHeader";

const StationIndexPanel = () => {
  return (
    <>
      <IndexSectionHeader
        title="서울 지하철 역세권 지수"
        selectedIndex={IndexState.stationIndex}
      />
      <Divider />
    </>
  );
};

export default StationIndexPanel;
