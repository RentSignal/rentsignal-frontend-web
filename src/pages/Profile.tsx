import { useEffect, useState } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";
import { getMyProfile, logout } from "@/services/userApi";

interface UserProfile {
  name: string;
  imageUrl: string;
  role: string;
}

type LayoutContext = {
  openLoginModal: () => void;
};

const myActivityMenu = [
  { id: 1, name: "내가 쓴 글", path: "/profile/posts" },
  { id: 2, name: "댓글 단 글", path: "/profile/comments" },
  { id: 3, name: "공감한 글", path: "/profile/likes" },
];

const settingsMenu = [
  { id: 1, name: "이름 변경", path: "/profile/name" },
  { id: 2, name: "이메일 변경", path: "/profile/email" },
  { id: 3, name: "휴대전화번호 변경", path: "/profile/phone" },
  { id: 4, name: "로그아웃", path: "/logout", isLogout: true },
  { id: 5, name: "탈퇴하기", path: "/profile/delete", danger: true },
];

const Profile = () => {
  const { openLoginModal } = useOutletContext<LayoutContext>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/", { replace: true });
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getMyProfile();
        setUser(profile);
      } catch (error) {
        openLoginModal();
      }
    };

    loadProfile();
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto">
      {/* 프로필 */}
      <div className="flex gap-4 p-4 border-b border-gray-200">
        <img
          src={user.imageUrl}
          className="object-cover rounded-full w-[66px] h-[66px]"
        />

        <div className="flex flex-col justify-center">
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-500">{user.role}</p>
        </div>
      </div>

      {/* 내 활동 */}
      <section>
        <h2 className="px-4 py-3 text-sm font-semibold text-gray-500 bg-gray-50">
          내 활동
        </h2>

        {myActivityMenu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center justify-between px-4 py-4 text-sm text-gray-700 border-b hover:bg-gray-50"
          >
            {item.name}
            <span>›</span>
          </Link>
        ))}
      </section>

      {/* 정보 수정 */}
      <section>
        <h2 className="px-4 py-3 text-sm font-semibold text-gray-500 bg-gray-50">
          정보 수정
        </h2>

        {settingsMenu.map((item) =>
          item.isLogout ? (
            <button
              key={item.id}
              onClick={handleLogout}
              className="flex items-center justify-between w-full px-4 py-4 text-sm text-gray-700 border-b hover:bg-gray-50"
            >
              {item.name}
              <span>›</span>
            </button>
          ) : (
            <Link
              key={item.id}
              to={item.path}
              className={`flex justify-between items-center px-4 py-4 border-b text-sm hover:bg-gray-50 ${
                item.danger ? "text-red-500" : "text-gray-700"
              }`}
            >
              {item.name}
              <span>›</span>
            </Link>
          ),
        )}
      </section>
    </div>
  );
};

export default Profile;
