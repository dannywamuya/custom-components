export interface PaginatedResponse<T> {
  data: T;
  totalPages: number;
  page: number;
  totalCount: number;
}
