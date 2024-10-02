/**
 * This file contains the types for the relations between nodes in the database.
 */

export type LikedRelation = {
  likedAt: Date;
  likedBy: string;
  id: string;
};

export type RetweetRelation = {
  retweetedAt: Date;
  retweetedBy: string;
  id: string;
};

export type PostedRelation = {
  createdAt: Date;
};

export type FollowRelation = {
  followerId: string;
  followeeId: string;
  followedAt: string;
  id: string;
};
