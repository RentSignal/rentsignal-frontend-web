import { loginWithNaver } from "@/services/auth";
import NaverLoginButton from "@/assets/social/naver_login.svg?react";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
};

const LoginModal = ({ open, onClose }: LoginModalProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white w-[460px] rounded-lg shadow-lg pt-10 pb-10 py-10 flex flex-col gap-10"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col gap-5">
          <h2 className="text-lg font-semibold text-center text-coolNeutral-25">
            로그인
          </h2>

          <p className="text-base text-center text-coolNeutral-50">
            RentSignal 커뮤니티 서비스를 이용하려면 <br /> 로그인이 필요합니다.
          </p>
        </div>

        <button onClick={loginWithNaver} className="flex justify-center">
          <NaverLoginButton />
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
