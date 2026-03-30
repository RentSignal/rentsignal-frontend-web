import { useEffect } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";

import { logout } from "@/services/userApi";
import { useUserStore } from "@/store/userStore";

import Post from "@/assets/icons/post.svg?react";
import Comment from "@/assets/icons/comment.svg?react";
import Favorite from "@/assets/icons/favorite.svg?react";
import RightArrow from "@/assets/icons/right_arrow.svg?react";

import Divider from "@/components/Divider";

type LayoutContext = {
  openLoginModal: () => void;
  openPhoneModal: () => void;
};

type MenuItem = {
  id: number;
  name: string;
  path?: string;
  action?: () => void;
  danger?: boolean;
};

function Profile() {
  const { openLoginModal, openPhoneModal } = useOutletContext<LayoutContext>();

  const navigate = useNavigate();
  const location = useLocation();

  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((s) => s.fetchUser);
  const clearUser = useUserStore((s) => s.clearUser);

  const isProfileRoot = location.pathname === "/profile";

  const handleLogout = async () => {
    await logout();
    clearUser();
    navigate("/");
  };

  const activityMenus = [
    { id: 1, icon: Post, label: "내가 쓴 글", path: "/profile/posts" },
    { id: 2, icon: Comment, label: "댓글 단 글", path: "/profile/comments" },
    { id: 3, icon: Favorite, label: "공감 단 글", path: "/profile/likes" },
  ];

  const settingsMenu: MenuItem[] = [
    { id: 1, name: "이름 변경", path: "/profile/name" },
    { id: 3, name: "휴대전화번호 변경", path: "/profile/phone" },
    { id: 4, name: "탈퇴하기", path: "/profile/delete" },
    { id: 5, name: "로그아웃", action: handleLogout, danger: true },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        await fetchUser();
      } catch {
        openLoginModal();
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!user) return;

    if (user.role === "ROLE_GUEST") {
      openPhoneModal();
    }
  }, [user]);

  if (!user) return null;

  return (
    <>
      <div className="flex flex-col max-w-md gap-[26px] px-6 pb-[32px] mx-auto ">
        {isProfileRoot ? (
          <>
            <ProfileHeader user={user} />
            <ActivityMenuSection menus={activityMenus} />
            <MenuSection title="정보 수정" menus={settingsMenu} />
          </>
        ) : (
          <Outlet />
        )}
      </div>
      <Divider />
    </>
  );
}

export default Profile;

function ProfileHeader({ user }: { user: any }) {
  return (
    <div className="flex gap-[18px]">
      <img
        src={user.imageUrl}
        className="object-cover rounded-full w-[61px] h-[61px]"
      />

      <div className="flex flex-col justify-center">
        <p className="text-base font-medium text-coolNeutral-25">{user.name}</p>
        <p className="text-sm font-medium text-coolNeutral-50">
          {user.role == "ROLE_USER" ? "@user" : "@guest"}
        </p>
      </div>
    </div>
  );
}

function ActivityMenuSection({ menus }: { menus: any[] }) {
  return (
    <div className="py-3 border rounded-lg border-blue-95 bg-blue-99">
      <div className="flex justify-center">
        {menus.map((item, index) => {
          const Icon = item.icon;

          return (
            <div key={item.id} className="flex items-center">
              <Link to={item.path} className="flex flex-col items-center px-6">
                <Icon />
                <p className="text-xs text-coolNeutral-25">{item.label}</p>
              </Link>

              {index !== menus.length - 1 && (
                <div className="w-px h-10 bg-gray-200" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MenuSection({ title, menus }: { title: string; menus: MenuItem[] }) {
  return (
    <section>
      <h2 className="text-base font-semibold pb-[14px] text-coolNeutral-25">
        {title}
      </h2>

      {menus.map((item) =>
        item.action ? (
          <button
            key={item.id}
            onClick={item.action}
            className={`flex justify-between items-center w-full text-sm font-medium hover:bg-gray-50 ${
              item.danger ? "text-[#FF4242]" : "text-coolNeutral-50"
            }`}
          >
            {item.name}
            <RightArrow />
          </button>
        ) : (
          <Link
            key={item.id}
            to={item.path!}
            className={`flex justify-between items-center pb-5 text-sm hover:bg-gray-50 ${
              item.danger ? "text-red-500" : "text-coolNeutral-50"
            }`}
          >
            {item.name}
            <RightArrow />
          </Link>
        ),
      )}
    </section>
  );
}
