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
    <div className="flex flex-col h-screen bg-white font-pretendard">
      <div className="flex items-center justify-center py-4 border-b border-coolNeutral-95 -mx-5">
        <button onClick={() => navigate(-1)} className="absolute left-4 p-1 text-coolNeutral-70">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-base font-semibold text-coolNeutral-30">
          이름 변경
        </h1>
        <div className="w-7" />
      </div>

      <div className="flex flex-col flex-1 px-2 pt-6 pb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 10))}
          placeholder={user?.name ?? "원래 사용자 이름 표시"}
          className="w-full h-[45px] px-6 rounded-xl border-2 border-blue-50 text-coolNeutral-25 outline-none focus:border-blue-50 placeholder:text-coolNeutral-25"
          style={{ fontSize: "15px", fontWeight: 400, letterSpacing: "0.144px" }}
        />
        <p 
          className="text-coolNeutral-25 mt-2 leading-relaxed"
          style={{ fontSize: "12px", letterSpacing: "0.233px" }}
        >
          이름은 <span className="text-blue-50">2자 이상</span>, 10자 이하의{" "}
          <span className="text-blue-50">한글</span>, <span className="text-blue-50">영문</span>만 가능합니다.
        </p>

        <div className="flex-1" />

        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`w-full h-[45px] px-2 mb-1 rounded-xl text-base font-semibold text-white transition-colors duration-150 ${
            isValid ? "bg-blue-60 active:bg-blue-50" : "bg-coolNeutral-70 cursor-not-allowed"
          }`}
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default UpdateName;
