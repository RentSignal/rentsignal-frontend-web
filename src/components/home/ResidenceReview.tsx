import { fetchResidenceReview } from "@/services/homeApi";
import type { ResidenceReviewItem as ResidenceReviewPost } from "@/types/home";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResidenceReviewItem from "./ResidencReviewItem";

const ResidenceReview = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ResidenceReviewPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const res = await fetchResidenceReview();
        const data = res.data as
          | { content?: ResidenceReviewPost[] }
          | ResidenceReviewPost[];
        const nextPosts = Array.isArray(data)
          ? data
          : Array.isArray(data.content)
            ? data.content
            : [];

        setPosts(nextPosts);
      } catch (e) {
        console.error("거주 리뷰 목록 조회 실패:", e);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <section className="pt-[50px] pb-[50px]">
      <div>
        <h2 className="pl-5 font-bold text-coolNeutral-25">거주 리뷰</h2>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-sm text-coolNeutral-60">
            불러오는 중...
          </div>
        ) : posts.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-coolNeutral-60">
            거주 리뷰가 없습니다.
          </div>
        ) : (
          posts.map((post) => (
            <ResidenceReviewItem
              key={post.id}
              post={post}
              onClick={() => navigate("/community")}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default ResidenceReview;
