import { fetchDataFromApiGet, fetchDataFromApiPost } from "./api";
import { OAUTH_URL, API_URL } from "./url";

export const getMyProfile = async () => {
  const res = await fetchDataFromApiGet({
    apiUrl: API_URL.MYPAGE_ME,
  });

  return res.data;
};

export const logout = async () => {
  const res = await fetchDataFromApiPost({
    apiUrl: OAUTH_URL.LOGOUT,
  });

  return res.success;
};

export const registerPhoneNumber = async (phone: string) => {
  const res = await fetchDataFromApiPost({
    apiUrl: OAUTH_URL.PHONE,
    body: { phone },
  });

  return res.success;
};

export const updatePhone = async (phone: string) => {
  const formData = new FormData();
  formData.append("phoneNum", phone);

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/mypage/me`, {
    method: "PATCH",
    body: formData,
    credentials: "include",
  });

  return res.json();
};

export const updateName = async (name: string) => {
  const formData = new FormData();
  formData.append("name", name);

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/mypage/me`, {
    method: "PATCH",
    body: formData,
    credentials: "include",
  });

  return res.json();
};