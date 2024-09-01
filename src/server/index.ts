import neo4j from 'neo4j-driver';

export const db = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USERNAME!, process.env.NEO4J_PASSWORD!)
);

export { TweetsService } from './services/tweets.service';
export { LikesService } from './services/likes.service';

export type { UserNode, TweetNode } from './models';
export type { PostedRelation, LikedRelation } from './relations';
