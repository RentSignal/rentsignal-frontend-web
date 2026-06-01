import { OAUTH_URL } from "./url.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ACCESS_TOKEN_KEY = "accessToken";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const setAccessToken = (accessToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const loginWithNaver = () => {
  window.location.href = `${API_BASE_URL}${OAUTH_URL.NAVER_LOGIN}`;
};

export const reissueToken = async (): Promise<string | null> => {
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
      return null;
    }

    const data = await response.json();
    const newAccessToken: string = data.accessToken ?? data.data?.accessToken;

    if (newAccessToken) {
      setAccessToken(newAccessToken);
    }

    return newAccessToken ?? null;
  } catch {
    clearAccessToken();
    return null;
  }
};

export const ensureAccessToken = async (): Promise<string | null> => {
  const accessToken = getAccessToken();

  if (accessToken) {
    return accessToken;
  }

  return reissueToken();
};
