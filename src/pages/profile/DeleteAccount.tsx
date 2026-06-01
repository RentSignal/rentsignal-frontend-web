import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { deleteAccount } from "@/services/userApi";

const REASONS = [
  "서비스 이용이 불편해서",
  "원하는 정보가 부족해서",
  "이용 빈도가 낮아서",
  "다른 서비스를 이용 중이라서",
  "기타 (직접 입력)",
];

const DeleteAccount = () => {
  const navigate = useNavigate();
  const clearUser = useUserStore((s) => s.clearUser);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const handleWithdraw = async () => {
    if (selected.size === 0) return;
    try {
      const reasons = [...selected].map((i) => REASONS[i]);
      await deleteAccount(reasons);
      clearUser();
      navigate("/");
    } catch (e) {
      console.error("탈퇴 실패:", e);
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
          탈퇴하기
        </h1>
        <div className="w-7" />
      </div>

      <p className="text-sm font-semibold text-blue-60 leading-relaxed px-1 py-4">
        탈퇴 시 계정 및 개인정보가 삭제되며 복구할 수 없습니다.<br />
        정말 탈퇴하시겠습니까?
      </p>

      <p className="text-sm font-semibold text-black mt-4 px-1 pb-4">
        탈퇴 하시는 이유를 선택해주세요.
      </p>

      <div className="flex flex-col">
        {REASONS.map((reason, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="flex items-center gap-3 px-1 py-2.5 text-left hover:bg-gray-50 transition-colors"
          >
            <span
              className={`w-5 h-5 rounded flex-shrink-0 border flex items-center justify-center transition-colors ${
                selected.has(i) ? "bg-blue-60" : "bg-white"
              }`}
              style={{ borderColor : "#D1D1D6"}}
            >
              {selected.has(i) && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <span className="text-sm font-Pretendard" style={{ color: "#2C2C2E" }}>{reason}</span>
          </button>
        ))}
      </div>

      <div className="mt-20 flex justify-end px-4 pb-6">
        <button
          onClick={handleWithdraw}
          disabled={selected.size === 0}
          className={`px-7 py-2 rounded-xl text-sm font-semibold transition-colors ${
            selected.size > 0 ? "bg-blue-60 text-white" : "bg-coolNeutral-70 text-white cursor-not-allowed"
          }`}
        >
          탈퇴하기
        </button>
      </div>
    </div>
  );
};

export default DeleteAccount;