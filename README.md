# rentsignal-frontend-web

렌트시그널 서비스의 프론트엔드 웹 애플리케이션 레포지토리입니다.

렌트시그널은 자취/월세 거주지를 고르는 사용자를 위해 지역 추천, 생활 정보, 교통 접근성, 커뮤니티 리뷰를 제공하는 서비스입니다.

## Tech Stack

<img src="https://img.shields.io/badge/React.js-%2320232a.svg?&logo=react&logoColor=%2361DAFB"/> <img src="https://img.shields.io/badge/Typescript-3178C6?logo=Typescript&logoColor=white"/> <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white"/> <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white"/>

## 주요 기능

### 홈

- 오늘의 추천 지역 조회
- 지하철 접근성이 높은 지역 TOP5 조회
- 추천 지역 및 지하철 접근성 데이터를 지도 오버레이와 연동
- 홈 거주 리뷰 목록 조회
- 거주 리뷰 본문을 최대 2문장, 2줄 미리보기로 표시

### 추천

- 3단계 추천 폼 제공
  - 거주 희망 위치 선택
  - 주거 형태 및 계약 형태 선택
  - 우선순위 조건 선택
- 조건 기반 맞춤 주거지 추천 API 연동
- 추천 결과 패널 표시
- 로그인 및 휴대폰 인증이 필요한 사용자 흐름 처리

### 정보

- 월세 지수 랭킹 조회
- 월세 지수 변동 랭킹 조회
- 소비 심리 지수 조회
- 지하철 접근성 지수 조회
- 편의시설, 안전, 교통 정보 조회
- 카카오맵 기반 지역/동네 오버레이 표시

### 커뮤니티

- 게시글 목록 조회
- 전체, 추천, 질문, 거주리뷰 탭 제공
- 탭 선택 시 `post.category === activeTab` 기준으로 클라이언트 필터링
- 동네명 검색 필터 제공
- 게시글 카드 본문을 2줄 미리보기로 표시
- 게시글 작성, 수정, 삭제
- 게시글 상세 패널 제공
- 상세 패널 상단 닫기 헤더 제공
- 게시글 공감 토글
- 댓글 조회, 작성, 삭제

### 프로필

- 내 정보 조회
- 내가 쓴 글 조회
- 내가 댓글 단 글 조회
- 내가 공감한 글 조회
- 이름 수정
- 휴대폰 번호 등록/수정
- 로그아웃
- 회원 탈퇴

### 인증

- 네이버 OAuth 로그인
- OAuth redirect 처리
- access token, refresh token 저장 및 재발급
- 인증 실패 시 로그인 모달 표시
- 게스트 사용자 휴대폰 번호 등록 모달 표시

## Routes

| Path | Description |
| --- | --- |
| `/` | 홈 |
| `/info` | 지역 정보 |
| `/recommend` | 맞춤 추천 |
| `/community` | 커뮤니티 |
| `/profile` | 마이페이지 |
| `/profile/posts` | 내가 쓴 글 |
| `/profile/comments` | 내가 댓글 단 글 |
| `/profile/likes` | 내가 공감한 글 |
| `/profile/name` | 이름 수정 |
| `/profile/phone` | 휴대폰 번호 수정 |
| `/profile/delete` | 회원 탈퇴 |
| `/oauth2/redirect` | OAuth 로그인 리다이렉트 |

## Project Structure

```txt
src/
  app/                 # 라우터 관련 코드
  assets/              # 아이콘, 이미지, geojson 등 정적 자산
  components/          # 공통 및 화면별 UI 컴포넌트
  constants/           # 지역, 지표, 색상 등 상수
  hooks/               # 커스텀 훅
  layouts/             # 메인 레이아웃, 사이드바
  pages/               # 라우트 단위 페이지
  services/            # API 요청 함수
  store/               # Zustand 전역 상태
  types/               # TypeScript 타입
  utils/               # 날짜, 지도, 추천 등 유틸 함수
```

## Install

1. 의존성 설치

```bash
npm install
```

2. `.env` 파일 생성

```bash
VITE_API_BASE_URL=API_BASE_URL
VITE_KAKAO_JS_KEY=JAVASCRIPT_KEY
```

- [프론트엔드 환경변수 페이지](https://www.notion.so/env-306064094cb0808ba58dd06c45442abb)

3. 개발 서버 실행

```bash
npm run dev
```

## Scripts

```bash
npm run dev      # 개발 서버 실행
npm run build    # TypeScript 빌드 및 Vite 프로덕션 빌드
npm run lint     # ESLint 검사
npm run preview  # 프로덕션 빌드 미리보기
```

## Members

|                                                                               |                                                                               |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| <img src="https://avatars.githubusercontent.com/u/181914316?v=4" width="80"/> | <img src="https://avatars.githubusercontent.com/u/232282659?v=4" width="80"/> |
| 최우진                                                                        | 한지민                                                                        |
