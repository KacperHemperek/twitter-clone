import { UserNode } from '@/server';

export type AccountDetails = UserNode & {
  followers: string[];
  following: string[];
};
