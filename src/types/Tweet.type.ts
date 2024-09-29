export type TweetAuthor = {
  email: string;
  name: string;
  id: string;
  image: string | undefined;
};

export type Tweet = {
  message: string;
  author: TweetAuthor;
  createdAt: Date;
  id: string;
  likes: { id: string; userId: string }[];
  comments?: {
    id: string;
  }[];
  retweets: { id: string; userId: string }[];
  retweetedBy: { name: string; userId: string } | null;
  tweetedAt?: Date;
};
