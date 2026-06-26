import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearAccessToken, ensureAccessToken } from "@/services/auth";

const OAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const params = new URLSearchParams(location.search);

      const error = params.get("error");

      if (error) {
        console.error("OAuth 로그인 오류:", error);
        navigate("/");
        return;
      }

      clearAccessToken();
      await ensureAccessToken();

      navigate("/");
    };

    initializeAuth();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-primary animate-spin" />
    </div>
  );
};

export default OAuthRedirect;
