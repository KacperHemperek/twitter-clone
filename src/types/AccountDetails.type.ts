import { User } from '@prisma/client';

export type AccountDetails = User & {
  followersCount: number;
  followingCount: number;
};
