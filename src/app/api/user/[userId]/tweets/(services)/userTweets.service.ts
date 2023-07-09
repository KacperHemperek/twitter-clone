import { ServerError } from '@/lib/serverError';

import { prisma } from '@/db/prisma';

const TWEET_LIMIT = 10;

export async function getUsersTweets(userId: string, page: number) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            parentId: null,
            authorId: userId,
          },
          {
            retweets: { some: { userId } },
          },
        ],
      },
      select: {
        author: true,
        createdAt: true,
        id: true,
        message: true,
        likes: true,
        comments: { select: { id: true } },
        retweets: true,
      },
      orderBy: { createdAt: 'desc' },
      take: TWEET_LIMIT,
      skip: (page - 1) * TWEET_LIMIT,
    });

    return posts;
  } catch (e) {
    throw new ServerError(500, 'There was a problem retrieving feed data');
  }
}

export async function getUserTweetsNew(userId: string, page: number) {
  try {
    const posts = await prisma.$queryRaw`
      SELECT * FROM (
        SELECT
            JSON_OBJECT(
                'id', Author.id,
                'name', Author.name,
                'email', Author.email,
                'image', Author.image
            ) as author,
            JSON_ARRAYAGG(JSON_OBJECT('id', Lk.id, 'userId', Lk.userId)) as likes,
            Post.id as id,
            Post.message as message,
            NULL as retweetedBy,
            Post.createdAt as createdAt,
            Post.createdAt as tweetedAt
        FROM Post
        JOIN User AS Author ON Post.authorId = Author.id
        RIGHT JOIN \`Like\` AS Lk ON Lk.postId = Post.id
        WHERE authorId = ${userId} AND parentId IS NULL
        GROUP BY Author.id, Post.id
        UNION ALL

        SELECT
            JSON_OBJECT(
                'id', Author.id,
                'name', Author.name,
                'email', Author.email,
                'image', Author.image
            ) as author,
            JSON_ARRAYAGG(JSON_OBJECT('id', Lk.id, 'userId', Lk.userId)) as likes,
            Post.id as id,
            Post.message as message,
            RetweetUser.name as retweetedBy,
            Post.createdAt as createdAt,
            Retweet.retweetedAt as tweetedAt
        FROM Retweet
        JOIN Post ON Retweet.postId = Post.id
        JOIN User AS Author ON Author.id = Post.authorId 
        JOIN User AS RetweetUser ON RetweetUser.id = Retweet.userId
        RIGHT JOIN \`Like\` AS Lk ON Lk.postId = Post.id
        WHERE Retweet.userId = ${userId} AND Post.parentId IS NULL
        GROUP BY Author.id, Post.id, Retweet.id
      ) as tweets
      ORDER BY tweetedAt DESC
      LIMIT ${TWEET_LIMIT}
      OFFSET ${(page - 1) * TWEET_LIMIT};
    `;
    return posts;
  } catch (e) {}
}
