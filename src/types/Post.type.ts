import { Like, User } from '@prisma/client';

export type Post = {
  message: string;
  author: User;
  createdAt: string;
  id: string;
  likes: Like[];
};
