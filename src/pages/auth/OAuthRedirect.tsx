import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("현재 URL:", window.location.href);
    // console.log("query string:", location.search);

    const params = new URLSearchParams(location.search);
    console.log("error param:", params.get("error"));

    navigate("/");
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-primary animate-spin" />
    </div>
  );
};

export default OAuthRedirect;
