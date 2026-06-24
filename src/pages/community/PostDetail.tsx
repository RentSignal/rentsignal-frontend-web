import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CommentModal from "@/components/community/CommentModal";
import {
  fetchPostDetail,
  togglePostLike,
  fetchComments,
  deletePost,
  deleteComment,
} from "@/services/communityApi";
import { useUserStore } from "@/store/userStore";
import type { PostDetail, Comment } from "@/types/community";
import { formatDateTime } from "@/utils/date";

interface PostDetailPageProps {
  postId: number;
  onClose: () => void;
  onEditClick: (postId: number) => void;
  onDeleteSuccess?: () => void;
}

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const PostDetailPage = ({ postId, onClose, onEditClick, onDeleteSuccess }: PostDetailPageProps) => {
  const currentUserId = useUserStore((s) => s.user?.userId);  
  const [post, setPost] = useState<PostDetail | null>(null);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [error, setError] = useState("");

  const loadComments = useCallback(async () => {
    try {
      const res = await fetchComments(postId);
      setComments(res.data.content);
    } catch (e) {
      console.error("댓글 조회 실패:", e);
    }
  }, [postId]);

  useEffect(() => {
    if (!postId) return;

    let ignore = false;

    const loadPost = async () => {
      try {
        const res = await fetchPostDetail(postId);
        if (ignore) return;
        setPost(res.data);
      } catch (e: unknown) {
        if (ignore) return;
        setError(getErrorMessage(e, "게시글을 불러올 수 없습니다."));
      }
    };

    const loadInitialComments = async () => {
      try {
        const res = await fetchComments(postId);
        if (ignore) return;
        setComments(res.data.content);
      } catch (e) {
        if (ignore) return;
        console.error("댓글 조회 실패:", e);
      }
    };

    loadPost();
    loadInitialComments();

    return () => {
      ignore = true;
    };
  }, [postId]);

  const handleLike = async () => {
    try {
      await togglePostLike(postId);
      setLiked((prev) => !prev);
    } catch (e: unknown) {
      console.error("공감 실패:", getErrorMessage(e, "공감에 실패했습니다."));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("게시글을 삭제하시겠습니까?")) return;
    try {
      await deletePost(postId);
      if (onDeleteSuccess) {
        onDeleteSuccess();
      } else {
        onClose();
      }
    } catch (e: unknown) {
      alert(getErrorMessage(e, "삭제에 실패했습니다."));
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-sm text-gray-400">
        <p>{error}</p>
        <button onClick={onClose} className="text-blue-500 text-xs underline">
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  if (!post) return null;
  console.log("currentUserId:", currentUserId);
  console.log("post.userId:", post.userId);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 본문 */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 pt-28">
        <div className="flex items-center justify-between mb-3">
            {/* 작성자 정보 */}
            <div className="flex items-center gap-4 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-semibold text-black">{post.userName}</p>
                    <p className="text-xs text-coolNeutral-70">{formatDateTime(post.createdAt)}</p>
                </div>
            </div>

            {/* 수정/삭제 버튼 */}
            {/* {isAuthor && ( */}
                <div className="flex justify-end gap-3 px-3 -mt-5">
                    <button
                        onClick={() => onEditClick(postId)}
                        className="flex items-center gap-1.5 text-xs text-coolNeutral-25 bg-blue-99 border border-blue-95 rounded-lg px-2.5 py-1 transition-colors"
                    >
                        수정
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-1.5 text-xs text-coolNeutral-25 bg-blue-99 border border-blue-95 rounded-lg px-2.5 py-1 transition-colors"
                    >
                        삭제
                    </button>
                </div>
            {/* )} */}
        </div>


        <h1 className="text-md font-semibold text-coolNeutral-25 mb-2 leading-snug">{post.title}</h1>
        <p className="text-sm text-coolNeutral-30 leading-relaxed mb-4 whitespace-pre-line">{post.content}</p>

        {/* 공감 / 댓글 버튼 */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm text-coolNeutral-25 bg-blue-99 border border-blue-95 rounded-lg px-2.5 py-1 transition-colors ${
              liked ? "text-coolNeutral-25" : "text-coolNeutral-25 hover:text-gray-600"
            }`}
          >
            <svg className="w-4 h-4" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            공감
          </button>
          <button
            onClick={() => setShowCommentModal(true)}
            className="flex items-center gap-1.5 text-sm text-coolNeutral-25 bg-blue-99 border border-blue-95 rounded-lg px-2.5 py-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            댓글 남기기
          </button>
        </div>

        {/* 구분선 */}
        <div className="h-2.5 bg-coolNeutral-99 -mx-4 shadow-[inset_0_1px_4px_0.1px_#E2E3E4] mb-4" />

        {/* 댓글 목록 */}
        <div>
          {comments.length === 0 ? (
            <p className="text-md text-coolNeutral-25 text-center py-12">아직 작성된 댓글이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-50 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <p className="text-sm font-semibold text-black">{comment.userName}</p>
                    </div>
                    {/* 댓글 삭제  */}
                    <div className="px-3">
                        <button
                            onClick={async () => {
                                if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
                                try {
                                    await deleteComment(comment.id);
                                    setComments((prev) => prev.filter((c) => c.id !== comment.id));
                                } catch (e: unknown) {
                                    alert(getErrorMessage(e, "삭제에 실패했습니다."));
                                }
                            }}
                            className="flex items-center gap-1.5 text-xs text-coolNeutral-25 bg-blue-99 border border-blue-95 rounded-lg px-2.5 py-1 transition-colors"
                        >
                            삭제
                        </button>
                    </div>
                </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{comment.content}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatDateTime(comment.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 댓글 모달 */}
      {showCommentModal && createPortal(
        <CommentModal
          postId={String(postId)}
          userName={post.userName}
          onClose={() => setShowCommentModal(false)}
          onSubmit={async () => {
            await loadComments();
            setShowCommentModal(false);
          }}
        />,
        document.body
      )}
    </div>
  );
};

export default PostDetailPage;
