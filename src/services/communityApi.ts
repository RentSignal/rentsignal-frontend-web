import {
  fetchDataFromApiGet,
  fetchDataFromApiPost,
  fetchDataFromApiPatch,
  fetchDataFromApiDelete,
} from "./api";
import { 
    COMMUNITY_URL,
    NEIGHBORHOOD_URL,
} from "./url";
import type {
  ApiResponse,
  PagedContent,
  Post,
  PostDetail,
  Comment,
  CreatePostRequest,
  UpdatePostRequest,
} from "@/types/community";

/* 게시글 목록 조회 */
export const fetchPosts = async (
  category: string,
  page = 0,
  size = 10,
): Promise<ApiResponse<PagedContent<Post>>> => {
  const res = await fetchDataFromApiGet({
    apiUrl: COMMUNITY_URL.POSTS,
    params: { category, page, size },
  });

  return res;
};

/* 게시글 상세 조회 */
export const fetchPostDetail = async (
  postId: string | number,
): Promise<ApiResponse<PostDetail>> => {
  const res = await fetchDataFromApiGet({
    apiUrl: COMMUNITY_URL.POST_DETAIL(postId),
  });

  return res;
};

/* 게시글 작성 */
export const createPost = async (
  payload: CreatePostRequest,
): Promise<ApiResponse<number>> => {
  const res = await fetchDataFromApiPost({
    apiUrl: COMMUNITY_URL.POSTS,
    body: payload,
  });

  return res;
};

/* 동네 검색 */
export const searchNeighborhood = async (
  keyword: string,
): Promise<{ neighborhoodId: number; neighborhoodName: string; districtName: string }[]> => {
  const res = await fetchDataFromApiGet({
    apiUrl: NEIGHBORHOOD_URL.SEARCH,
    params: { keyword },
  });
  return res.data ?? [];
};

/* 게시글 수정 */
export const updatePost = async (
  postId: string | number,
  payload: UpdatePostRequest,
): Promise<ApiResponse<null>> => {
  const res = await fetchDataFromApiPatch({
    apiUrl: COMMUNITY_URL.POST_DETAIL(postId),
    body: payload,
  });

  return res;
};

/* 게시글 삭제 */
export const deletePost = async (
  postId: string | number,
): Promise<ApiResponse<null>> => {
  const res = await fetchDataFromApiDelete({
    apiUrl: COMMUNITY_URL.POST_DETAIL(postId),
  });

  return res;
};

/* 게시글 좋아요 토글 */
export const togglePostLike = async (
  postId: string | number,
): Promise<ApiResponse<null>> => {
  const res = await fetchDataFromApiPost({
    apiUrl: COMMUNITY_URL.POST_LIKE(postId),
  });

  return res;
};

/* 댓글 목록 조회 */
export const fetchComments = async (
  postId: string | number,
  page = 0,
  size = 20, 
): Promise<ApiResponse<PagedContent<Comment>>> => {
  const res = await fetchDataFromApiGet({
    apiUrl: COMMUNITY_URL.COMMENTS(postId),
    params: { page, size },
  });

  return res;
};

/* 댓글 작성 */
export const createComment = async (
  postId: string | number,
  content: string,
): Promise<ApiResponse<null>> => {
  const res = await fetchDataFromApiPost({
    apiUrl: COMMUNITY_URL.COMMENTS(postId),
    body: { content },
  });

  return res;
};

/* 댓글 삭제 */
export const deleteComment = async (
  commentId: number,
): Promise<ApiResponse<null>> => {
  const res = await fetchDataFromApiDelete({
    apiUrl: COMMUNITY_URL.COMMENT_DETAIL(commentId),
  });

  return res;
};

/* 댓글 좋아요 토글 */
export const toggleCommentLike = async (
  commentId: number,
): Promise<ApiResponse<null>> => {
  const res = await fetchDataFromApiPost({
    apiUrl: COMMUNITY_URL.COMMENT_LIKE(commentId),
  });

  return res;
};