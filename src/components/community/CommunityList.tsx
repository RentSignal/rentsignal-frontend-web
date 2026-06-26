import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { fetchPosts } from "@/services/communityApi";
import type { Post } from "@/types/community";

const TABS = [
  { label: "추천", value: "추천" },
  { label: "질문", value: "질문" },
  { label: "거주리뷰", value: "거주리뷰" },
];

interface CommunityListProps {
  onWriteClick: () => void;
  onPostClick: (postId: number) => void;
}

const CommunityList = ({ onWriteClick, onPostClick }: CommunityListProps) => {
  const [activeTab, setActiveTab] = useState(TABS[0].value);
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const res = await fetchPosts(activeTab);
        setPosts(res.data.content);
      } catch (e) {
        console.error("게시글 목록 조회 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [activeTab]);

  const filteredPosts = search.trim()
    ? posts.filter((p) => p.neighborhoodName?.includes(search.trim()))
    : posts;

  return (
    <div className="relative flex flex-col flex-shrink-0 w-full h-full bg-white border-r border-gray-100">
      {/* 검색창 */}
      <div className="relative px-4 mt-5 mb-7">
        <svg
          className="absolute w-5 h-5 text-blue-500 -translate-y-1/2 left-8 top-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='관심있는 "동"을 입력해보세요.'
          className="w-full pl-11 pr-8 py-2.5 rounded-full bg-blue-99 border-2 border-blue-90 text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-blue-60"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute flex items-center justify-center w-5 h-5 text-white -translate-y-1/2 rounded-full right-7 top-1/2 bg-blue-70"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
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
            {search
              ? `"${search}" 동네의 게시글이 없습니다.`
              : "게시글이 없습니다."}
          </div>
        ) : (
          filteredPosts.map(
            (post) =>
              activeTab === post.category && (
                <PostCard
                  key={post.id}
                  post={post}
                  onClick={() => onPostClick(post.id)}
                />
              ),
          )
        )}
      </div>

      {/* 글쓰기 버튼 */}
      <div className="absolute z-10 -translate-x-1/2 bottom-20 left-1/2">
        <button
          onClick={onWriteClick}
          className="flex items-center gap-2 px-6 py-2 text-sm text-coolNeutral-30 font-semibold transition-colors border rounded-full bg-blue-95 border-blue-90 hover:bg-gray-50"
        >
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          글 쓰기
        </button>
      </div>
    </div>
  );
};

export default CommunityList;
