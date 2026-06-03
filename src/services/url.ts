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

  /* 정보 탭 */
  RENT_INDEX_RANKINGS: "/api/info/rent-index/current",
  RENT_INDEX_CHANGE: "/api/info/rent-index/change",
  CONSUMER_INDEX: "/api/info/consumer-sentiment",
  SUBWAY_INDEX: "/api/info/subway-accessibility",
  CONVENIENCE_INFO: "/api/info/convenience",
  TRANSPORT_INFO: "/api/info/transport",
};
