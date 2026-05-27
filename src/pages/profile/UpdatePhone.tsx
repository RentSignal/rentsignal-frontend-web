import { useState } from "react";
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
    <div className="flex flex-col h-screen">
      <div className="flex items-center px-4 py-4 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1 text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-base font-semibold">전화번호 변경</h1>
        <div className="w-7" />
      </div>

      <div className="flex flex-col flex-1 px-4 pt-5 pb-6">
        <input
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={handleChange}
          className={`w-full px-3.5 py-3 rounded-xl border-2 text-sm outline-none transition-colors ${
            showError ? "border-red-400" : "border-blue-500"
          }`}
        />

        {showError && (
          <p className="text-xs text-red-500 mt-1.5">
            * 하이픈(-) 없이 11자리 숫자를 입력해주세요.
          </p>
        )}

        <div className="flex-1" />

        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`w-full py-4 rounded-xl text-base font-semibold transition-colors ${
            isValid ? "bg-blue-500 text-white" : "bg-gray-300 text-white cursor-not-allowed"
          }`}
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default UpdatePhone;
