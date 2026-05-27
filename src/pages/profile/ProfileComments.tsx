import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Comment {
  id: number;
  postId: number;
  userId: number;
  userName: string;
  content: string;
  likeCount: number;
  createdAt: string;
}

const ProfileComments = () => {
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/community/mypage/comments?page=0&size=20`, {
        credentials: "include",
      });
      const data = await res.json();
      setComments(data.data.content);
    };
    fetchComments();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center px-4 py-4 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1 text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-base font-semibold">댓글 단 글</h1>
        <div className="w-7" />
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {comments.map((comment) => (
          <div key={comment.id} className="px-4 py-4 cursor-pointer hover:bg-gray-50">
            <p className="text-sm font-semibold text-gray-900 mb-1">{comment.content}</p>
            <p className="text-xs text-gray-400">@{comment.userName} · {comment.createdAt}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="flex items-center justify-center h-40 text-sm text-gray-400">
            댓글이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileComments;
