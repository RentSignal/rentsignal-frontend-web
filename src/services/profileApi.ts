import { fetchDataFromApiGet } from "./api";
import type { ProfileApiResponse, ProfilePagedContent, ProfilePost } from "@/types/profile";
import { PROFILE_URL } from "./url";

/* 댓글 단 글 목록 조회 */
export const fetchMyCommentedPosts = async (
  page = 0,
  size = 20,
): Promise<ProfileApiResponse<ProfilePagedContent<ProfilePost>>> => {
  const res = await fetchDataFromApiGet({
    apiUrl: PROFILE_URL.MY_COMMENTED_POSTS,
    params: { page, size },
  });
  return res;
};

/* 공감한 글 목록 조회 */
export const fetchMyLikedPosts = async (
  page = 0,
  size = 20,
): Promise<ProfileApiResponse<ProfilePagedContent<ProfilePost>>> => {
  const res = await fetchDataFromApiGet({
    apiUrl: PROFILE_URL.MY_LIKED_POSTS,
    params: { page, size },
  });
  return res;
};

/* 내가 쓴 글 목록 조회 */
export const fetchMyPosts = async (
  page = 0,
  size = 20,
): Promise<ProfileApiResponse<ProfilePagedContent<ProfilePost>>> => {
  const res = await fetchDataFromApiGet({
    apiUrl: PROFILE_URL.MY_POSTS,
    params: { page, size },
  });
  return res;
};