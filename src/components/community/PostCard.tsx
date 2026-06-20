import type { Post } from "@/types/community";

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

const PostCard = ({ post, onClick }: PostCardProps) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("ko-KR", {
    month: "numeric",
    day: "numeric",
  });

  return (
    <div onClick={onClick} className="px-4 py-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors">
      <div className="flex gap-1.5 mb-2 flex-wrap">
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 border border-blue-100 font-medium">
          {post.category}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-100 font-medium">
          {post.neighborhoodName}
        </span>
      </div>
      <p className="text-sm font-semibold text-gray-900 mb-1 leading-snug">{post.title}</p>
      <p className="text-xs text-gray-500 mb-2 line-clamp-1 leading-relaxed">{post.content}</p>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">@{post.userName} · {formattedDate}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>♡ {post.likeCount}</span>
          <span>· 댓글 {post.commentCount}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;