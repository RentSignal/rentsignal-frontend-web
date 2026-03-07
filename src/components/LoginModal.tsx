import { loginWithNaver } from "@/services/auth";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
};

const LoginModal = ({ open, onClose }: LoginModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[360px] rounded-md shadow-lg p-6 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-center">로그인</h2>

        <p className="text-sm text-center text-gray-500">
          RentSignal 서비스를 이용하려면 로그인이 필요합니다.
        </p>

        <button
          onClick={loginWithNaver}
          className="py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
        >
          네이버로 로그인
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
