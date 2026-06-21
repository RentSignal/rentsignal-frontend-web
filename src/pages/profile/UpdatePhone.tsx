import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { updatePhone } from "@/services/userApi";
import { 
  sanitizePhoneNumber,
  validatePhoneNumber,
} from "@/utils/phone";

const UpdatePhone = () => {
  const navigate = useNavigate();
  const fetchUser = useUserStore((s) => s.fetchUser);
  const user = useUserStore((state) => state.user);
  const [phone, setPhone] = useState(user?.phoneNum ?? "");
  const [touched, setTouched] = useState(false);

  const isValid = validatePhoneNumber(phone);
  const showError = touched && phone.length > 0 && !isValid;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizePhoneNumber(e.target.value); 
    setPhone(sanitized.slice(0, 11));
    setTouched(true);
  };

  const handleSave = async () => {
    if (!isValid) return;

    try {
      await updatePhone(phone);
      await fetchUser();
      navigate("/profile");
    } catch (e) {
      console.error("전화번호 변경 실패:", e);
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
          전화번호 변경
        </h1>
        <div className="w-7" />
      </div>

      <div className="flex flex-col flex-1 px-2 pt-6 pb-6">
        <input
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={handleChange}
          placeholder={user?.phoneNum ?? "전화번호를 입력해주세요"}
          className={`w-full h-[45px] px-6 rounded-xl border-2 text-coolNeutral-25 outline-none transition-colors ${
            showError ? "border-blue-50" : "border-blue-50"
          }`}
        />

        {showError && (
          <p className="text-xs text-atomic-red-50 mt-1.5">
            * 하이픈(-) 없이 11자리 숫자를 입력해주세요.
          </p>
        )}

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

export default UpdatePhone;
