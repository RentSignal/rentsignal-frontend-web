import { useEffect, useState } from "react";
import { fetchPostDetail, updatePost } from "@/services/communityApi";

interface EditPostModalProps {
  postId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const EditPostModal = ({ postId, onClose, onSuccess }: EditPostModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await fetchPostDetail(postId);
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (e: any) {
        setError(e.message ?? "게시글을 불러올 수 없습니다.");
      }
    };
    loadPost();
  }, [postId]);

  const handleSubmit = async () => {
    if (!title.trim()) return setError("제목을 입력해주세요.");
    if (!content.trim()) return setError("내용을 입력해주세요.");
    setLoading(true);
    setError("");
    try {
      await updatePost(postId, { title, content });
      onSuccess();
    } catch (e: any) {
      setError(e.message ?? "수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = title.trim() && content.trim();

  return (
    <div className="flex-1 flex flex-col bg-white border-l border-gray-100">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h1 className="text-md font-semibold text-coolNeutral-25">게시글 수정</h1>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className={`text-sm font-semibold transition-colors ${
            canSubmit && !loading ? "text-blue-500 hover:text-blue-600" : "text-gray-300"
          }`}
        >
          {loading ? "저장 중..." : "완료"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="bg-blue-95 px-3 py-2.5">
          <p className="text-xs text-coolNeutral-25 leading-relaxed">
            다른 사람을 비방하거나, 타인에게 불쾌감을 유발하는 부적절한 표현, 영리 목적의 광고는 삭제될 수 있습니다.
          </p>
        </div>

        {/* 제목 */}
        <div className="relative px-5 pt-4">
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (error) setError(""); }}
            placeholder="제목을 입력해주세요."
            className="w-full text-md text-coolNeutral-25 placeholder:text-[#A9A9A9] placeholder:text-sm outline-none border border-blue-90 rounded-xl px-3 py-2 h-[42px] mb-4 focus:border-blue-300 transition-colors"
          />
        </div>

        {/* 내용 */}
        <div className="px-5 mb-4">
          <textarea
            value={content}
            onChange={(e) => { setContent(e.target.value); if (error) setError(""); }}
            placeholder={`해당 동네에 궁금한 점이나 나누고 싶은 이야기를\n자유롭게 작성해주세요.`}
            className={`w-full h-[200px] px-3 py-3 text-sm text-coolNeutral-25 placeholder:text-[#A9A9A9] outline-none resize-none leading-relaxed rounded-xl transition-colors ${
              content ? "border border-blue-90" : "border-none"
            }`}
          />
        </div>

        {error && <p className="text-xs text-red-500 px-5">{error}</p>}
      </div>
    </div>
  );
};

export default EditPostModal;