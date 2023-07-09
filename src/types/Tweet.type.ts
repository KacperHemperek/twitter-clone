import { Like, Retweet, User } from '@prisma/client';

export type Tweet = {
  message: string;
  author: Pick<User, 'email' | 'name' | 'id' | 'image'>;
  createdAt: Date;
  id: string;
  likes: Pick<Like, 'id' | 'userId'>[];
  comments?: {
    id: string;
  }[];
  retweets: Pick<Retweet, 'id' | 'userId'>[];
  retweetedBy?: string;
  tweetedAt?: Date;
};
