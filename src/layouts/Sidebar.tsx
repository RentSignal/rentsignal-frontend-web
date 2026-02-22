import { NavLink } from 'react-router-dom';
import type { ComponentType, SVGProps } from 'react'
import HomeIcon from '@/assets/icons/home.svg?react'
import InfoIcon from '@/assets/icons/info.svg?react'
import RecommendIcon from '@/assets/icons/recommend.svg?react'
import CommunityIcon from '@/assets/icons/community.svg?react';
import ProfileIcon from '@/assets/icons/profile.svg?react';

type MenuItem = {
  name: string
  path: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

const Sidebar = () => {
  const menu: MenuItem[] = [
    { name: '홈', path: '/', icon: HomeIcon },
    { name: '정보', path: '/info', icon: InfoIcon },
    { name: '추천', path: '/recommend', icon: RecommendIcon },
    { name: '커뮤니티', path: '/community', icon: CommunityIcon },
    { name: '프로필', path: '/profile', icon: ProfileIcon },
  ];

  return (
    <div className="w-[60px] h-full bg-white flex flex-col items-stretch border-r pt-10 gap-10">
    {menu.map((item) => (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 w-full py-3 text-sm ${
          isActive
            ? 'text-primary font-medium'
            : 'text-textDefault'
        }`
      }
    >
        {item.icon && (
          <item.icon width={24} height={24} fill="currentColor" />
        )}
        {item.name}
      </NavLink>
    ))}
    </div>
  );
};

export default Sidebar;
