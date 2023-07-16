import { ServerError } from '@/lib/serverError';

import { prisma } from '@/db/prisma';

const TWEET_LIMIT = 10;

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
            COALESCE(
              (
                SELECT JSON_ARRAYAGG(JSON_OBJECT('id', Lk.id, 'userId', Lk.userId))
                FROM \`Like\` AS Lk
                WHERE Lk.postId = Post.id
              ) ,
              JSON_ARRAY()
            ) as likes,
            COALESCE(
              (
                SELECT JSON_ARRAYAGG(JSON_OBJECT('id', Rt.id, 'userId', Rt.userId))
                FROM Retweet AS Rt
                WHERE Rt.postId = Post.id
              ),
              JSON_ARRAY()
            ) as retweets,
            COALESCE(
              (
                SELECT JSON_ARRAYAGG(JSON_OBJECT('id', Comment.id))
                FROM Post AS Comment
                WHERE Comment.parentId = Post.id
              )
            ) as comments,
            Post.id as id,
            Post.message as message,
            NULL as retweetedBy,
            Post.createdAt as createdAt,
            Post.createdAt as tweetedAt
        FROM Post
        JOIN User AS Author ON Post.authorId = Author.id
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
            COALESCE(
              (
                SELECT JSON_ARRAYAGG(JSON_OBJECT('id', Lk.id, 'userId', Lk.userId))
                FROM \`Like\` AS Lk
                WHERE Lk.postId = Post.id
              ),
              JSON_ARRAY()
            ) as likes,
            COALESCE(
              (
                SELECT JSON_ARRAYAGG(JSON_OBJECT('id', Rt.id, 'userId', Rt.userId))
                FROM Retweet AS Rt
                WHERE Rt.postId = Post.id
              ),
              JSON_ARRAY()
            ) as retweets,
            COALESCE(
              (
                SELECT JSON_ARRAYAGG(JSON_OBJECT('id', Comment.id))
                FROM Post AS Comment
                WHERE Comment.parentId = Post.id
              )
            ) as comments,
            Post.id as id,
            Post.message as message,
            JSON_OBJECT('name',RetweetUser.name, 'userId', RetweetUser.id) as retweetedBy,
            Post.createdAt as createdAt,
            Retweet.retweetedAt as tweetedAt
        FROM Retweet
        JOIN Post ON Retweet.postId = Post.id
        JOIN User AS Author ON Author.id = Post.authorId 
        JOIN User AS RetweetUser ON RetweetUser.id = Retweet.userId
        WHERE Retweet.userId = ${userId} AND Post.parentId IS NULL
        GROUP BY Author.id, Post.id, Retweet.id, RetweetUser.id
      ) as tweets
      ORDER BY tweetedAt DESC
      LIMIT ${TWEET_LIMIT}
      OFFSET ${(page - 1) * TWEET_LIMIT};
    `;
    return posts;
  } catch (e) {
    throw new ServerError({
      code: 404,
      message: "Couldn't retrieve tweets for user",
    });
  }
}
