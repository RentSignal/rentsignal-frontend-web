import type { ResidenceReviewItem } from "@/types/home";
import { formatDateTime } from "@/utils/date";

interface PostCardProps {
  post: ResidenceReviewItem;
  onClick: () => void;
}

const ResidenceReviewCard = ({ post, onClick }: PostCardProps) => {
  return (
    <div
      onClick={onClick}
      className="px-5 py-4 transition-colors border-b border-gray-100 cursor-pointer hover:bg-coolNeutral-99"
    >
      <div className="flex flex-wrap gap-1 mb-2 text-coolNeutral-30">
        <span className="text-xs px-1.5 py-1 rounded-full bg-blue-99 border border-blue-70 font-Pretendard">
          {post.category}
        </span>
        {post.neighborhoodName && (
          <span className="text-xs px-1.5 py-1 rounded-full bg-blue-99 border border-blue-70 font-Pretendard">
            {post.neighborhoodName}
          </span>
        )}
      </div>
      <p className="mb-1 font-medium text-black text-md opacity-80">
        {post.title}
      </p>
      <p className="mb-1 text-sm font-Pretendard text-coolNeutral-50">
        {post.content}
      </p>
      <p className="text-xs font-Pretendard text-coolNeutral-70">
        @{post.userName} · {formatDateTime(post.createdAt)}
      </p>
    </div>
  );
};

export default ResidenceReviewCard;
