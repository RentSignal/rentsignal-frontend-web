import { useState } from "react";
import { createPost } from "@/services/communityApi";
import { searchNeighborhood } from "@/services/communityApi";

const TABS = [
  { label: "추천", value: "RECOMMEND" },
  { label: "질문", value: "QUESTION" },
  { label: "거주리뷰", value: "REVIEW" },
];

interface WritePostModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const WritePostModal = ({ onClose, onSuccess }: WritePostModalProps) => {
  const [category, setCategory] = useState(TABS[0].value);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [neighborhoodId, setNeighborhoodId] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<{ neighborhoodId: number; neighborhoodName: string; districtName: string }[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNeighborhoodChange = async (value: string) => {
    setNeighborhood(value);
    setNeighborhoodId(null);
    if (!value.trim()) { setSuggestions([]); return; }
    try {
      const data = await searchNeighborhood(value);
      setSuggestions(data);
    } catch (e) {
      console.error("동네 검색 실패:", e);
    }
  };

  const handleSubmit = async () => {
    setError("");
    // if (!neighborhoodId) { setError("동네를 선택해주세요."); return; }
    setLoading(true);
    try {
      await createPost({ category, title, content, neighborhoodId });
      onSuccess();
      onClose();
    } catch (e: any) {
      setError(e.message ?? "게시글 작성에 실패했습니다.");
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
        <h1 className="text-md font-Pretendard text-coolNeutral-25">게시글 작성</h1>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className={`text-sm font-Pretendard transition-colors ${
            canSubmit && !loading ? "text-blue-500 hover:text-blue-600" : "text-[#3385FF]"
          }`}
        >
          {loading ? "등록 중..." : "등록"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="bg-blue-95 px-3 py-2.5">
            <p className="text-xs text-coolNeutral-25 leading-relaxed font-Pretendard">
                다른 사람을 비방하거나, 타인에게 불쾌감을 유발하는 부적절한 표현, 영리 목적의 광고는 삭제될 수 있습니다.
            </p>
        </div>
    
        {/* 카테고리 */}
        <div className="flex gap-5 px-5 py-4">
          {TABS.map((tab) => (
            <label key={tab.value} className="flex items-center gap-1.5 text-sm text-coolNeutral-25 cursor-pointer">
              <input
                type="radio"
                checked={category === tab.value}
                onChange={() => setCategory(tab.value)}
                className="blue-50"
              />
              {tab.label}
            </label>
          ))}
        </div>

        {/* 제목 */}
        <div className="relative px-5">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해주세요."
                className="w-full text-md text-coolNeutral-25 font-Pretendard placeholder:text-[#A9A9A9] placeholder:text-sm outline-none border border-blue-90 rounded-xl h-[45px] px-3 py-2.5 mb-4 focus:border-blue-300 transition-colors"
            />
            {!title && (
                <span className="absolute top-1/3 -translate-y-1/2 left-[calc(8.5rem+12px)] text-[#FF4242] text-md">*</span>
            )}
        </div>

        {/* 내용 */}
        <div className="px-5">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`해당 동네에 궁금한 점이나 나누고 싶은 이야기를\n자유롭게 작성해주세요.`}
                className={`w-full h-[250px] px-4 py-2 text-sm text-coolNeutral-25 placeholder-coolNeutral-90 font-normal outline-none resize-none mb-4 leading-relaxed ${
                    content ? "border border-blue-90 rounded-xl" : "border-none"
                }`} 
            />
        </div>
        

        {/* 동네 검색 */}
        <div className="relative px-5">
          <div className="flex items-center border border-[#DBDBDB] rounded-xl px-3 py-2.5 focus-within:border-blue-300 transition-colors">
            <input
              type="text"
              value={neighborhood}
              onChange={(e) => handleNeighborhoodChange(e.target.value)}
              placeholder="동네를 입력해주세요."
              className="flex-1 text-sm outline-none text-blue-60 font-Pretendard placeholder-text-[#A9A9A9]"
            />
            {neighborhood && (
              <button
                onClick={() => { setNeighborhood(""); setNeighborhoodId(null); setSuggestions([]); }}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-white bg-blue-70 rounded-full w-5 h-5 flex items-center justify-center"
              >
                <svg className="w-5 h-5 px-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="absolute top-full left-5 right-5 bg-white border border-[#DBDBDB] rounded-xl shadow-sm mt-1 z-10 overflow-hidden">
              {suggestions.map((s) => (
                <button
                  key={s.neighborhoodId}
                  onClick={() => { setNeighborhood(s.neighborhoodName); setNeighborhoodId(s.neighborhoodId); setSuggestions([]); }}
                  className="w-full text-left px-4 py-3 text-sm text-coolNeutral-50 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                >
                  {s.districtName} {s.neighborhoodName}
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

export default WritePostModal;