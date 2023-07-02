import { User } from '@prisma/client';

export type AccountDetails = User & {
  followers: string[];
  following: string[];
};
