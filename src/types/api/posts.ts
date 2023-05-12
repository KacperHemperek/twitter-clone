import { Post } from '../Post.type';

export type GetPostsType = {
  nextPage: number | undefined;
  data: Post[];
};
