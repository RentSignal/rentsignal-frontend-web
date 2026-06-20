import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "./PostCard";
import { fetchPosts } from "@/services/communityApi";
import type { Post } from "@/types/community";

const TABS = [
  { label: "추천", value: "RECOMMEND" },
  { label: "질문", value: "QUESTION" },
  { label: "거주리뷰", value: "REVIEW" },
];

const CommunityList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TABS[0].value);
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    /*const loadPosts = async () => {
      setLoading(true);
      try {
        const res = await fetchPosts(activeTab);
        setPosts(res.data.content);
      } catch (e) {
        console.error("게시글 목록 조회 실패:", e);*/
        //테스트
    setPosts([
        {
            id: 1,
            title: "월세고민이 있습니다.",
            content: "안녕하세요. 현재 월세 계약을 고민하고 있어서 조언을 구하고 싶습니다.",
            category: "추천",
            userId: 1,
            userName: "닉네임",
            neighborhoodName: "강남구",
            likeCount: 3,
            commentCount: 2,
            viewCount: 10,
            createdAt: "2026-03-20T12:00:00",
        },
        {
            id: 2,
            title: "이 동네 살기 어때요?",
            content: "강남구 이사 고민 중인데 어떤지 궁금합니다.",
            category: "질문",
            userId: 2,
            userName: "홍길동",
            neighborhoodName: "도곡동",
            likeCount: 5,
            commentCount: 1,
            viewCount: 20,
            createdAt: "2026-03-21T09:00:00",
        },
    ]);
      /*} finally {
        setLoading(false);
      }
    };
    loadPosts();*/
  }, [activeTab]);

  const filteredPosts = search.trim()
    ? posts.filter((p) => p.neighborhoodName.includes(search.trim()))
    : posts;
    
  // return 바로 위에 추가
    console.log("posts:", posts);
    console.log("filteredPosts:", filteredPosts); 

  return (
    <div className="flex flex-col w-full flex-shrink-0 h-full border-r border-gray-100 bg-white">
      {/* 검색창 */}
      <div className="relative px-4 mt-5 mb-7">
        <svg className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='관심있는 "동"을 입력해보세요.'
          className="w-full pl-11 pr-8 py-2.5 rounded-full bg-blue-99 border-2 border-blue-90 text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-blue-60"
        />
        <button onClick={() => setSearch("")} className="absolute right-7 top-1/2 -translate-y-1/2 text-white bg-blue-70 rounded-full w-5 h-5 flex items-center justify-center">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2.5 px-4 mb-3">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-2 py-1 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-400 border border-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 게시글 목록 */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-sm text-gray-400">
            불러오는 중...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-sm text-gray-400">
            {search ? `"${search}" 동네의 게시글이 없습니다.` : "게시글이 없습니다."}
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => navigate(`/community/${post.id}`)}
            />
          ))
        )}
      </div>

      {/* 글쓰기 버튼 */}
      <div className="px-4 py-3 border-t border-gray-100">
        <button
          onClick={() => navigate("/community/write")}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          글 쓰기
        </button>
      </div>
    </div>
  );
};

export default CommunityList;