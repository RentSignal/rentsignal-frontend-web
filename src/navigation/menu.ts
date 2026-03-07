import type { ComponentType, SVGProps } from "react";

import HomeIcon from "@/assets/icons/home.svg?react";
import InfoIcon from "@/assets/icons/info.svg?react";
import RecommendIcon from "@/assets/icons/recommend.svg?react";
import CommunityIcon from "@/assets/icons/community.svg?react";
import ProfileIcon from "@/assets/icons/profile.svg?react";

export type MenuItem = {
  id: number;
  title: string;
  path: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  children?: MenuItem[];
};

export const menuItems: MenuItem[] = [
  {
    id: 1,
    title: "홈",
    path: "/",
    icon: HomeIcon,
  },
  {
    id: 2,
    title: "정보",
    path: "/info",
    icon: InfoIcon,
  },
  {
    id: 3,
    title: "추천",
    path: "/recommend",
    icon: RecommendIcon,
  },
  {
    id: 4,
    title: "커뮤니티",
    path: "/community",
    icon: CommunityIcon,
  },
  {
    id: 5,
    title: "프로필",
    path: "/profile",
    icon: ProfileIcon,
  },
];
