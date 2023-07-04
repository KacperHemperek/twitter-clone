import { ServerError } from '@/lib/serverError';

import { prisma } from '@/db/prisma';

export async function retweetTweet(postId: string, userId: string) {
  try {
    await prisma.retweet.create({
      data: { postId, userId },
    });
  } catch (err) {
    throw new ServerError(500, `Couldn't retweet your tweet`);
  }
}
