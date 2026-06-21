export type ProfilePost = {
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

export type ProfilePagedContent<T> = {
  content: T[];
  pageable?: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  number?: number;
  size?: number;
};

export type ProfileApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};