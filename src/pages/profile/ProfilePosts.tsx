import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  category: string;
  userId: number;
  userName: string;
  neighborhoodName: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
}

const ProfilePosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/community/mypage/posts?page=0&size=20`, {
        credentials: "include",
      });

      const data = await res.json();
      setPosts(data.data.content);
    };
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center px-4 py-4 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1 text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-base font-semibold">내가 쓴 글</h1>
        <div className="w-7" />
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {posts.map((post) => (
          <div key={post.id} className="px-4 py-4 cursor-pointer hover:bg-gray-50">
            <div className="flex gap-1.5 mb-2 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 border border-blue-100">
                {post.category}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 border border-blue-100">
                {post.neighborhoodName}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">{post.title}</p>
            <p className="text-xs text-gray-400">@{post.userName} · {post.createdAt}</p>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="flex items-center justify-center h-40 text-sm text-gray-400">
            게시글이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePosts;