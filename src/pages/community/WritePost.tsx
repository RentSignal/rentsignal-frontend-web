import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "@/services/communityApi";

const TABS = [
  { label: "추천", value: "RECOMMEND" },
  { label: "질문", value: "QUESTION" },
  { label: "거주리뷰", value: "REVIEW" },
];

const WritePostPage = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState(TABS[0].value);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [neighborhoodId, setNeighborhoodId] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<{ id: number; name: string }[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNeighborhoodChange = async (value: string) => {
    setNeighborhood(value);
    setNeighborhoodId(null);
    if (!value.trim()) { setSuggestions([]); return; }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/neighborhood/search?keyword=${value}`,
        { credentials: "include" },
      );
      const data = await res.json();
      setSuggestions(data.data ?? []);
    } catch (e) {
      console.error("동네 검색 실패:", e);
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!neighborhoodId) { setError("동네를 선택해주세요."); return; }
    setLoading(true);
    try {
      const res = await createPost({ category, title, content, neighborhoodId });
      navigate(`/community/${res.data}`);
    } catch (e: any) {
      setError(e.message ?? "게시글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = title.trim() && content.trim() && neighborhoodId;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <button onClick={() => navigate("/community")} className="text-gray-500 hover:text-gray-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h1 className="text-base font-semibold text-gray-900">게시글 작성</h1>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className={`text-sm font-semibold transition-colors ${canSubmit && !loading ? "text-blue-500 hover:text-blue-600" : "text-gray-300"}`}
        >
          {loading ? "등록 중..." : "등록"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          다른 사람을 비방하거나, 타인에게 불쾌감을 유발하는 부적절한 표현, 영리 목적의 광고는 삭제될 수 있습니다.
        </p>

        <div className="flex gap-4 mb-4">
          {TABS.map((tab) => (
            <label key={tab.value} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
              <input type="radio" checked={category === tab.value} onChange={() => setCategory(tab.value)} className="accent-blue-500" />
              {tab.label}
            </label>
          ))}
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해주세요. *"
          className="w-full text-sm font-semibold text-gray-800 placeholder-gray-300 outline-none border-b border-gray-100 pb-3 mb-4 focus:border-blue-300 transition-colors"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="해당 동네에 궁금한 점이나 나누고 싶은 이야기를 자유롭게 작성해주세요."
          className="w-full h-40 text-sm text-gray-600 placeholder-gray-300 outline-none resize-none mb-4 leading-relaxed"
        />

        <div className="relative">
          <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-blue-300 transition-colors">
            <input
              type="text"
              value={neighborhood}
              onChange={(e) => handleNeighborhoodChange(e.target.value)}
              placeholder="동"
              className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
            />
            {neighborhood && (
              <button onClick={() => { setNeighborhood(""); setNeighborhoodId(null); setSuggestions([]); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-sm mt-1 z-10 overflow-hidden">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setNeighborhood(s.name); setNeighborhoodId(s.id); setSuggestions([]); }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default WritePostPage;