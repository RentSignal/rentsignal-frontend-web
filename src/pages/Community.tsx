import { Outlet } from "react-router-dom";

const Community = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <Outlet />
    </div>
  );
};

export default Community;