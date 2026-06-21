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


export const PROFILE_URL = {
  MY_COMMENTED_POSTS: "/api/community/mypage/comments",
   MY_LIKED_POSTS: "/api/community/mypage/likes",
   MY_POSTS: "/api/community/mypage/posts",
};