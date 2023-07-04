import { Like, User } from '@prisma/client';

export type Tweet = {
  message: string;
  author: User;
  createdAt: Date;
  id: string;
  likes: Like[];
  comments?: {
    id: string;
  }[];
  retweets: {
    id: string;
    userId: string;
    postId: string;
  }[];
  retweetedBy?: string;
};
