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
