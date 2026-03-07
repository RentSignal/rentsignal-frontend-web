import { OAUTH_URL } from "./url.ts";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginWithNaver = () => {
  window.location.href = `${API_BASE_URL}${OAUTH_URL.NAVER_LOGIN}`;
};

// env파일 관련 로그
// console.log(import.meta.env);
