export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T;
  errorCode?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
