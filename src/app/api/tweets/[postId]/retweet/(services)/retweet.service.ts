import { ServerError } from '@/lib/server';

import { prisma } from '@/db/prisma';

export async function getRetweets(postId: string) {
  try {
    const tweet = await prisma.post.findUnique({
      where: { id: postId },
      select: { retweets: { select: { userId: true } } },
    });

    return tweet?.retweets?.map((retweet) => retweet.userId) ?? [];
  } catch (err) {
    throw new ServerError({ code: 500, message: `Couldn't get retweets` });
  }
}

export async function retweetTweet(postId: string, userId: string) {
  try {
    await prisma.retweet.create({
      data: { postId, userId },
    });
  } catch (err) {
    throw new ServerError({
      code: 500,
      message: `Couldn't retweet your tweet`,
    });
  }
}

export async function removeRetweet(postId: string, userId: string) {
  try {
    await prisma.retweet.deleteMany({
      where: { userId, postId },
    });
  } catch (err) {
    throw new ServerError({ code: 500, message: `Couldn't remove retweet` });
  }
}
