import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommentModal from "@/components/community/CommentModal";
import { fetchPostDetail, togglePostLike, fetchComments, deletePost } from "@/services/communityApi";
import { useUserStore } from "@/store/userStore";
import type { PostDetail, Comment } from "@/types/community";

const PostDetailPage = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const currentUserId = useUserStore((s) => s.user?.userId);

  const [post, setPost] = useState<PostDetail | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!postId) return;

    const loadPost = async () => {
      try {
        const res = await fetchPostDetail(postId);
        setPost(res.data);
        setLikeCount(res.data.likeCount);
      } catch (e: any) {
        setError(e.message ?? "게시글을 불러올 수 없습니다.");
      }
    };

    const loadComments = async () => {
      try {
        const res = await fetchComments(postId);
        setComments(res.data.content);
      } catch (e) {
        console.error("댓글 조회 실패:", e);
      }
    };

    loadPost();
    loadComments();
  }, [postId]);

  const handleLike = async () => {
    if (!postId) return;
    try {
      await togglePostLike(postId);
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (e: any) {
      console.error("공감 실패:", e.message);
    }
  };

  const handleDelete = async () => {
    if (!postId) return;
    if (!window.confirm("게시글을 삭제하시겠습니까?")) return;
    try {
      await deletePost(postId);
      navigate("/community");
    } catch (e: any) {
      alert(e.message ?? "삭제에 실패했습니다.");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-sm text-gray-400">
        <p>{error}</p>
        <button onClick={() => navigate("/community")} className="text-blue-500 text-xs underline">
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  if (!post) return null;

  const isAuthor = currentUserId !== undefined && currentUserId === post.userId;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <button onClick={() => navigate("/community")} className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {isAuthor && (
          <div className="flex gap-3 text-xs text-gray-400">
            <button onClick={() => navigate(`/community/${postId}/edit`)} className="hover:text-gray-600 transition-colors">수정</button>
            <button onClick={handleDelete} className="hover:text-red-500 transition-colors">삭제</button>
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{post.userName}</p>
            <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        <h1 className="text-base font-semibold text-gray-900 mb-3 leading-snug">{post.title}</h1>
        <p className="text-sm text-gray-600 leading-relaxed mb-4 whitespace-pre-line">{post.content}</p>

        <div className="flex gap-4 py-3 border-t border-b border-gray-100 mb-4">
          <button onClick={handleLike} className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? "text-blue-500" : "text-gray-400 hover:text-gray-600"}`}>
            <svg className="w-4 h-4" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            공감 {likeCount}
          </button>
          <button onClick={() => setShowCommentModal(true)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            댓글 남기기
          </button>
        </div>

        {comments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">아직 작성된 댓글이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-50 pb-4">
                <p className="text-sm font-medium text-gray-800 mb-1">{comment.userName}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{comment.content}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(comment.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCommentModal && postId && (
        <CommentModal
          postId={postId}
          userName={post.userName}
          onClose={() => setShowCommentModal(false)}
          onSubmit={(newComment) => {
            setComments((prev) => [...prev, newComment]);
            setShowCommentModal(false);
          }}
        />
      )}
    </div>
  );
};

export default PostDetailPage;