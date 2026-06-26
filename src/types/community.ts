export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

export type Pageable = {
  pageNumber: number;
  pageSize: number;
};

export type PagedContent<T> = {
  content: T[];
  pageable?: Pageable;
  number?: number;
  size?: number;
  totalPages: number;
  totalElements: number;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  category: string; 
  userId: number;
  userName: string;
  neighborhoodName: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
};

export type PostDetail = Post & {
  role: string;
  updatedAt: string;
  isLiked: boolean;
};

export type CreatePostRequest = {
  category: string;
  title: string;
  content: string;
  neighborhoodId: number | null;
};

export type UpdatePostRequest = {
  title: string;
  content: string;
};

export type Comment = {
  id: number;
  postId: number;
  userId: number;
  userName: string;
  content: string;
  likeCount: number;
  createdAt: string;
};

export type CreateCommentRequest = {
  content: string;
};