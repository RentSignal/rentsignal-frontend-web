import { useState } from "react";
import { sanitizePhoneNumber, validatePhoneNumber } from "@/utils/phone";
import { registerPhoneNumber } from "@/services/userApi";
import { useUserStore } from "@/store/userStore";

type phoneModalProps = {
  open: boolean;
  onClose: () => void;
};

const PhoneModal = ({ open, onClose }: phoneModalProps) => {
  const [phone, setPhone] = useState("");
  const fetchUser = useUserStore((s) => s.fetchUser);
  const isValid = validatePhoneNumber(phone);
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = sanitizePhoneNumber(e.target.value);

    if (value.length <= 11) {
      setPhone(value);
    }
  };
  const handleSubmit = async () => {
    const success = await registerPhoneNumber(phone);

    if (success) {
      await fetchUser();
      onClose();
    }
  };
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-[360px] rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-2 text-xl font-semibold">회원가입</h2>

          <p className="mb-6 text-gray-600 text-md">
            휴대전화번호 인증이 필요합니다. 휴대전화번호는 외부에 노출되지
            않습니다.
          </p>

          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="휴대전화번호 입력"
            className="w-full px-3 py-2 mb-4 border rounded-md"
          />

          <button
            onClick={handleSubmit}
            disabled={!validatePhoneNumber(phone)}
            className={`w-full py-2 rounded-md text-white
                        ${isValid ? "bg-primary" : "bg-gray-300 cursor-not-allowed"}
                      `}
          >
            인증하기
          </button>
        </div>
      </div>
    </>
  );
};

export default PhoneModal;
