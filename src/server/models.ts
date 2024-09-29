/**
 * This file contains the types for the models in the database.
 */

/**
 * Represents a tweet node's properties
 */
export type TweetNode = {
  id: string;
  message: string;
};

/**
 * Represents a user node's properties
 */
export type UserNode = {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | undefined;
  image: string | undefined;
  background: string | undefined;
  description: string | undefined;
  born: Date | undefined;
  location: string | undefined;
};
