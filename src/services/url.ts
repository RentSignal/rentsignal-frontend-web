/* Oauth, auth 인증 관련 */
export const OAUTH_URL = {
  NAVER_LOGIN: "/oauth2/authorization/naver",
  //   GOOGLE_LOGIN: "",
  LOGOUT: "/api/auth/logout",
  PHONE: "/api/auth/phone",
  REISSUE: "/api/auth/reissue",
};

export const API_URL = {
  /* 내 정보 조회 */
  MYPAGE_ME: "/api/mypage/me",

  /* 추천 탭 */
  RECOMMEND: "/api/recommend",
};

/* 커뮤니티 탭 */
export const COMMUNITY_URL = {
  /* 게시글 목록 조회, 게시글 작성 */
  POSTS: "/api/community/posts", 
  /* 게시글 상세 조회, 게시글 수정, 게시글 삭제 */
  POST_DETAIL: (postId: string | number) =>
    `/api/community/posts/${postId}`, 
  /* 게시글 좋아요 토글 */
  POST_LIKE: (postId: string | number) =>
    `/api/community/posts/${postId}/likes`, 
  /* 댓글 목록 조회, 댓글 작성 */
  COMMENTS: (postId: string | number) =>
    `/api/community/posts/${postId}/comments`, 
  /* 댓글 삭제 */
  COMMENT_DETAIL: (commentId: number) =>
    `/api/community/comments/${commentId}`, 
  /* 댓글 좋아요 토글 */
  COMMENT_LIKE: (commentId: number) =>
    `/api/community/comments/${commentId}/likes`, 
};

export const NEIGHBORHOOD_URL = {
  SEARCH: "/api/community/neighborhoods/search",

export const PROFILE_URL = {
  MY_COMMENTED_POSTS: "/api/community/mypage/comments",
   MY_LIKED_POSTS: "/api/community/mypage/likes",
   MY_POSTS: "/api/community/mypage/posts",
};