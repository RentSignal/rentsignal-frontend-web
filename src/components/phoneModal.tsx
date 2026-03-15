import { useState } from "react";
import { sanitizePhoneNumber, validatePhoneNumber } from "@/utils/phone";
import { registerPhoneNumber } from "@/services/userApi";
import { useUserStore } from "@/store/userStore";

import DoneIcon from "@/assets/icons/done_ring_round.svg?react";

type PhoneModalProps = {
  open: boolean;
  onClose: () => void;
};

const PhoneModal = ({ open, onClose }: PhoneModalProps) => {
  const [phone, setPhone] = useState("");
  const [completed, setCompleted] = useState(false);

  const fetchUser = useUserStore((s) => s.fetchUser);

  const isValid = validatePhoneNumber(phone);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = sanitizePhoneNumber(e.target.value);

    if (value.length <= 11) {
      setPhone(value);
    }
  };

  const handleSubmit = async () => {
    if (!isValid) return;

    const success = await registerPhoneNumber(phone);

    if (success) {
      await fetchUser();
      setCompleted(true);
    }
  };

  if (!open) return null;

  // 성공 Dialog
  if (completed) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
        <div className="w-[460px] rounded-lg bg-white px-6 pt-[60px] pb-[40px] text-center shadow-lg flex flex-col items-center gap-5">
          <div className="flex flex-col gap-[10px]">
            <h3 className="text-lg font-semibold">감사합니다.</h3>
            <p className="text-sm text-gray-500">인증이 완료되었습니다.</p>
          </div>

          <DoneIcon className="w-[126px]" />

          <button
            onClick={() => {
              setCompleted(false);
              onClose();
            }}
            className="w-full py-3 text-white rounded-md bg-blue-60"
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[460px] rounded-lg bg-white px-5 pt-[60px] pb-[48px] shadow-lg">
        <div className="flex flex-col gap-5">
          <h2 className="mb-2 text-xl font-semibold">회원가입</h2>

          <p className="text-base text-coolNeutral-50">
            휴대전화번호 인증이 필요합니다. 휴대전화번호는 외부에 노출되지
            않습니다.
          </p>

          <div>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="휴대전화번호 입력"
              className="w-full px-4 py-3 mb-1 border rounded-lg border-blue-50"
            />

            {phone.length > 0 && !isValid && (
              <p className="text-xs text-red">
                * 하이픈(-) 없이 11자리 숫자를 입력해주세요.
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full rounded-md py-[19px] mt-6
            ${
              isValid
                ? "bg-blue-60 text-white"
                : "bg-[#F8F8F8] text-[#BBBBBB] cursor-not-allowed"
            }`}
        >
          다음
        </button>
      </div>
    </div>
  );
};
4;

export default PhoneModal;
