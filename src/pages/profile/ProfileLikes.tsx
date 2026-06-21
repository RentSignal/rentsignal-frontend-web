import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyLikedPosts } from "@/services/profileApi";
import type { ProfilePost } from "@/types/profile";

const ProfileLikes = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ProfilePost[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetchMyLikedPosts();
        setPosts(res.data.content);
      } catch (e) {
        console.error("공감한 글 조회 실패:", e);
      }
    };
    loadPosts();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white font-Pretendard">
      <div className="flex items-center justify-center py-4 border-b border-coolNeutral-95 -mx-5">
        <button onClick={() => navigate(-1)} className="absolute left-4 p-1 text-coolNeutral-70">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-base font-semibold text-coolNeutral-30">공감 단 글</h1>
        <div className="w-7" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {posts.map((post) => (
          <div key={post.id} className="py-3 cursor-pointer hover:bg-coolNeutral-99 font-Pretendard">
            <div className="flex gap-1 mb-2 flex-wrap text-coolNeutral-30">
              <span className="text-xs px-1.5 py-1 rounded-full bg-blue-99 border border-blue-70">
                {post.category}
              </span>
              <span className="text-xs px-1.5 py-1 rounded-full bg-blue-99 border border-blue-70">
                {post.neighborhoodName}
              </span>
            </div>
            <p className="text-md font-medium text-black opacity-80 mb-1">{post.title}</p>
            <p className="text-sm text-coolNeutral-50 mb-1">{post.content}</p>
            <p className="text-xs text-coolNeutral-70">@{post.userName} · {post.createdAt}</p>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="flex items-center justify-center h-40 text-sm text-coolNeutral-70">
            공감한 글이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileLikes;