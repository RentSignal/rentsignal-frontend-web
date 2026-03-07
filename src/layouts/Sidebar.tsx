import { NavLink } from "react-router-dom";
import { menuItems } from "@/navigation/menu";

const Sidebar = () => {
  return (
    <div className="w-[60px] h-full bg-white flex flex-col items-stretch border-r pt-10 gap-10">
      {menuItems.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 w-full py-3 text-sm ${
              isActive ? "text-primary font-medium" : "text-textDefault"
            }`
          }
        >
          {item.icon && (
            <item.icon width={24} height={24} fill="currentColor" />
          )}
          {item.title}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
