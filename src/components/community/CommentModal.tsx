import { useState } from "react";
import { createComment } from "@/services/communityApi";
import type { Comment } from "@/types/community";

interface CommentModalProps {
  postId: string;
  userName: string;
  onClose: () => void;
  onSubmit: (comment: Comment) => void;
}

const CommentModal = ({ postId, userName, onClose, onSubmit }: CommentModalProps) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("댓글 내용을 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      await createComment(postId, content);
      onSubmit({
        id: Date.now(),
        postId: Number(postId),
        userId: 0,
        userName,
        content,
        likeCount: 0,
        createdAt: new Date().toISOString(),
      });
    } catch (e: any) {
      setError(e.message ?? "댓글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center px-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-md w-full h-[300px] max-w-sm p-5 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-coolNeutral-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-md font-bold text-coolNeutral-25">댓글 작성</span>
        </div>

        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); if (error) setError(""); }}
          placeholder={`@${userName}으로 댓글 남기기`}
          className="w-full h-[180px] text-sm text-coolNeutral-25 placeholder:text-coolNeutral-90 outline-none resize-none border border-blue-90 rounded-md p-3 mb-2focus:border-blue-300 transition-colors"
        />

        {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={!content.trim() || loading}
          className={`w-full py-2 mt-2 rounded-md text-sm font-semibold transition-colors ${
            content.trim() && !loading ? "bg-blue-60 text-white hover:bg-blue-600" : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "등록 중..." : "댓글 남기기"}
        </button>
      </div>
    </div>
  );
};

export default CommentModal;