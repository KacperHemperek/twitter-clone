export type PaginatedResponse<T> = {
  data: T[];
  nextPage?: number;
};
