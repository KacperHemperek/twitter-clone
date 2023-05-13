import { PaginatedResponse } from '@/types/api/pagination';

export type InfiniteQueryData<T> = {
  pages: PaginatedResponse<T>[];
  pageParams: string[];
};

export function reduceDataFromInfiniteQuery<T>(
  data: InfiniteQueryData<T>
): T[] {
  return data.pages
    .map((item) => item.data)
    .reduce((acc, curr) => [...acc, ...curr], []);
}
