import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { updateName } from "@/services/userApi";

const UpdateName = () => {
  const navigate = useNavigate();
  const fetchUser = useUserStore((s) => s.fetchUser);
  const user = useUserStore((state) => state.user);
  const [name, setName] = useState(user?.name ?? "");

  const isValid = /^[가-힣a-zA-Z]{2,10}$/.test(name);

  const handleSave = async () => {
    if (!isValid) return;
    try {
      await updateName(name);
      await fetchUser();
      navigate("/profile");
    } catch (e) {
      console.error("이름 변경 실패:", e);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center px-4 py-4 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1 text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-base font-semibold">이름 변경</h1>
        <div className="w-7" />
      </div>

      <div className="flex flex-col flex-1 px-4 pt-5 pb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 10))}
          className="w-full px-3.5 py-3 rounded-xl border-2 border-blue-500 text-sm outline-none focus:border-blue-600"
        />
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          이름은 <span className="text-blue-500">2자 이상</span>, 10자 이하의{" "}
          <span className="text-blue-500">한글</span>, <span className="text-blue-500">영문</span>만 가능합니다.
        </p>

        <div className="flex-1" />

        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`w-full py-4 mb-10 rounded-xl text-base font-semibold transition-colors ${
            isValid ? "bg-blue-500 text-white" : "bg-gray-300 text-white cursor-not-allowed"
          }`}
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default UpdateName;
