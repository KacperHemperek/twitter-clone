import { Like, User } from '@prisma/client';

export type Post = {
  message: string;
  author: User;
  createdAt: Date;
  id: string;
  likes: Like[];
  comments?: {
    id: string;
  }[];
};
