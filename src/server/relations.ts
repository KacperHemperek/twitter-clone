/**
 * This file contains the types for the relations in the database.
 */

/**
 * Represents a liked relation's properties
 */
export type LikedRelation = {
  likedAt: Date;
  likedBy: string;
  id: string;
};

/**
 * Represents a liked relation's properties
 */
export type RetweetRelation = {
  retweetedAt: Date;
  retweetedBy: string;
  id: string;
};

/**
 * Represents a posted relation's properties
 */
export type PostedRelation = {
  createdAt: Date;
};
