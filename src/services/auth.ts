import { OAUTH_URL } from "./url.ts";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(
  /\/+$/,
  "",
);
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
let reissuePromise: Promise<boolean> | null = null;

export const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const loginWithNaver = () => {
  window.location.href = `${API_BASE_URL}${OAUTH_URL.NAVER_LOGIN}`;
};

const requestReissueToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}${OAUTH_URL.REISSUE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      clearAccessToken();
      return false;
    }

    return true;
  } catch {
    clearAccessToken();
    return false;
  }
};

export const reissueToken = async (): Promise<boolean> => {
  if (!reissuePromise) {
    reissuePromise = requestReissueToken().finally(() => {
      reissuePromise = null;
    });
  }

  return reissuePromise;
};

export const ensureAccessToken = async (): Promise<boolean> => reissueToken();
