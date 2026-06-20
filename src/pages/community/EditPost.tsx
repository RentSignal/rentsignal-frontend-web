import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPostDetail, updatePost } from "@/services/communityApi";

const EditPostPage = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postId) return;
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
    if (!postId) return;
    if (!title.trim()) return setError("제목을 입력해주세요.");
    if (!content.trim()) return setError("내용을 입력해주세요.");
    setLoading(true);
    setError("");
    try {
      await updatePost(postId, { title, content });
      navigate(`/community/${postId}`);
    } catch (e: any) {
      setError(e.message ?? "수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h1 className="text-base font-semibold text-gray-900">게시글 수정</h1>
        <button
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim() || loading}
          className={`text-sm font-semibold transition-colors ${title.trim() && content.trim() && !loading ? "text-blue-500 hover:text-blue-600" : "text-gray-300"}`}
        >
          {loading ? "저장 중..." : "완료"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        <input
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); if (error) setError(""); }}
          placeholder="제목을 입력해주세요."
          className="w-full text-sm font-semibold text-gray-800 placeholder-gray-300 outline-none border-b border-gray-100 pb-3 mb-4 focus:border-blue-300 transition-colors"
        />
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); if (error) setError(""); }}
          placeholder="내용을 입력해주세요."
          className="w-full h-60 text-sm text-gray-600 placeholder-gray-300 outline-none resize-none leading-relaxed"
        />
        {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default EditPostPage;