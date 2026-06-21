import type { Post } from "@/types/community";

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

const PostCard = ({ post, onClick }: PostCardProps) => {
  return (
    <div onClick={onClick} className="px-4 py-4 cursor-pointer hover:bg-coolNeutral-99 border-b border-gray-100 transition-colors">
      <div className="flex gap-1 mb-2 flex-wrap text-coolNeutral-30">
        <span className="text-xs px-1.5 py-1 rounded-full bg-blue-99 border border-blue-70 font-Pretendard">
          {post.category}
        </span>
        {post.neighborhoodName && (
            <span className="text-xs px-1.5 py-1 rounded-full bg-blue-99 border border-blue-70 font-Pretendard">
                {post.neighborhoodName}
            </span>
        )}
      </div>
      <p className="text-md font-medium text-black opacity-80 mb-1">{post.title}</p>
      <p className="text-sm font-Pretendard text-coolNeutral-50 mb-1">{post.content}</p>
      <p className="text-xs font-Pretendard text-coolNeutral-70">@{post.userName} · {post.createdAt}</p>
    </div>
  );
};

export default PostCard;