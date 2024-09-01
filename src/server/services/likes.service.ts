import { db } from '@/server';

export module LikesService {
  export async function likeTweet({
    userId,
    tweetId,
  }: {
    userId: string;
    tweetId: string;
  }) {
    const session = db.session();

    await session.run(
      `
      MATCH (u:User {id: $userId}), (t:Tweet {id: $tweetId})
      MERGE (u)-[:LIKED { id: randomUUID(), likedAt: datetime(), likedBy: u.id}]->(t);
      `,
      { userId, tweetId }
    );

    await session.close();
  }

  export async function dislikeTweet({
    tweetId,
    userId,
  }: {
    tweetId: string;
    userId: string;
  }) {
    const session = db.session();

    await session.run(
      `
      MATCH (u:User {id: $userId})-[l:LIKED]->(t:Tweet {id: $tweetId})
      DELETE l;
      `,
      {
        tweetId,
        userId,
      }
    );

    await session.close();
  }

  export async function isLiked({
    tweetId,
    userId,
  }: {
    tweetId: string;
    userId: string;
  }): Promise<boolean> {
    const session = db.session();

    const response = await session.run(
      `
      MATCH (u:User {id: $userId})-[:LIKED]->(t:Tweet {id: $tweetId})
      RETURN COUNT(t) > 0 AS isLiked
      `,
      { userId, tweetId }
    );

    console.log(response.records[0].get('isLiked'));

    return response.records[0].get('isLiked') as boolean;
  }
}
