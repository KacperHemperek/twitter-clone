import { Record } from 'neo4j-driver';

import { Tweet } from '@/types/Tweet.type';

import { Neo4jUtils } from '@/utils/neo4j';

import {
  LikedRelation,
  PostedRelation,
  TweetNode,
  UserNode,
  db,
} from '@/server';
import { RetweetRelation } from '@/server/relations';

type Pagination = {
  page: number;
  limit: number;
};

type OptionalPagination = Partial<Pagination>;

const DefaultPagination: Pagination = {
  page: 1,
  limit: 10,
};

export module TweetsService {
  export async function getHomePageTweets({
    page = DefaultPagination.page,
    limit = DefaultPagination.limit,
  }: Pagination): Promise<Tweet[]> {
    const session = db.session();
    const pagination = Neo4jUtils.pagination(page, limit);

    const response = await session.run(
      `
      MATCH (tweet:Tweet)<-[posted:POSTED]-(author:User)
      WHERE NOT (tweet)-[:COMMENTS]->(:Tweet)
      OPTIONAL MATCH (tweet)<-[like:LIKED]-(:User)
      OPTIONAL MATCH (comment:Tweet)-[:COMMENTS]->(tweet)
      OPTIONAL MATCH (tweet)<-[retweet:RETWEETED]-(:User)
      RETURN 
        tweet,
        author,
        posted,
        collect(DISTINCT like) as likes,
        collect(DISTINCT comment) as comments,
        collect(DISTINCT retweet) as retweets
      ORDER BY posted.createdAt DESC
      SKIP $skip 
      LIMIT $limit;
      `,
      pagination
    );

    await session.close();

    return response.records.map(getTweetFromResponse);
  }

  export async function createTweet({
    message,
    userId,
  }: {
    message: string;
    userId: string;
  }): Promise<Tweet> {
    const session = db.session();
    const response = await session.run(
      `
        MATCH (author:User {id: $userId})
        CREATE (author)-[posted:POSTED {createdAt: datetime()}]->(tweet:Tweet {id: randomUUID(), message: $message, createdAt: datetime()})
        RETURN tweet, posted, author;
        `,
      { userId, message }
    );
    const tweet = Neo4jUtils.simplifyResponse<TweetNode>(
      response.records[0].get('tweet')
    );
    const relation = Neo4jUtils.simplifyResponse<PostedRelation>(
      response.records[0].get('posted')
    );
    const author = Neo4jUtils.simplifyResponse<UserNode>(
      response.records[0].get('author')
    );

    if (!tweet || !relation || !author) {
      throw new Error('Failed to read response');
    }

    await session.close();

    return {
      tweetedAt: relation.createdAt,
      createdAt: relation.createdAt,
      author: {
        name: author.name,
        email: author.email,
        id: author.id,
        image: author.image,
      },
      id: tweet.id,
      message: tweet.message,
      retweetedBy: null,
      retweets: [],
      likes: [],
      comments: [],
    };
  }

  export async function getTweetDetails(tweetId: string): Promise<Tweet> {
    const session = db.session();

    const response = await session.run(
      `
      MATCH (tweet:Tweet {id: $tweetId})-[posted:POSTED]-(author:User)
      OPTIONAL MATCH (tweet)<-[like:LIKED]-(:User)
      OPTIONAL MATCH (comment:Tweet)-[:COMMENTS]->(tweet)
      OPTIONAL MATCH (tweet)<-[retweet:RETWEETED]-(:User)
      RETURN 
       tweet, 
       author, 
       posted, 
       collect(DISTINCT like) as likes,
       collect(DISTINCT comment) as comments,
       collect(DISTINCT retweet) as retweets;
      `,
      { tweetId }
    );

    return getTweetFromResponse(response.records[0]);
  }

  export async function createComment({
    authorId,
    message,
    parentId,
  }: {
    authorId: string;
    message: string;
    parentId: string;
  }): Promise<Tweet> {
    const session = db.session();
    const response = await session.run(
      `
      MATCH (author:User {id: $authorId}), (parent:Tweet {id: $parentId})
      CREATE (author)-[posted:POSTED {createdAt: datetime()}]->(comment:Tweet {id: randomUUID(), message: $message})-[:COMMENTS]->(parent)
      RETURN comment, posted, author;
      `,
      {
        authorId,
        message,
        parentId,
      }
    );

    await session.close();

    const comment = Neo4jUtils.simplifyResponse<TweetNode>(
      response.records[0].get('comment')
    );
    const relation = Neo4jUtils.simplifyResponse<PostedRelation>(
      response.records[0].get('posted')
    );
    const author = Neo4jUtils.simplifyResponse<UserNode>(
      response.records[0].get('author')
    );
    if (!comment || !relation || !author) {
      throw new Error('Failed to read comment response');
    }

    return {
      tweetedAt: relation.createdAt,
      createdAt: relation.createdAt,
      author,
      id: comment.id,
      message: comment.message,
      retweetedBy: null,
      retweets: [],
      likes: [],
      comments: [],
    };
  }

  export async function getTweetsFromFollowedUsers({
    userId,
    limit,
    page,
  }: Pagination & { userId: string }) {
    const pagination = Neo4jUtils.pagination(page, limit);
    const session = db.session();

    try {
      const result = await session.run(
        `
      MATCH (u:User { id: $userId })-[:FOLLOWS]->(f:User)
      MATCH (f)-[postedOrRetweeted:POSTED|RETWEETED]->(tweet:Tweet)
      MATCH (tweet)<-[posted:POSTED]-(author:User)
      WHERE NOT (tweet)-[:COMMENTS]->(:Tweet) 
      OPTIONAL MATCH (ru:User)-[:RETWEETED]->(tweet)
      OPTIONAL MATCH (tweet)<-[like:LIKED]-(:User)
      OPTIONAL MATCH (comment:Tweet)-[:COMMENTS]->(tweet)
      OPTIONAL MATCH (:User)-[retweet:RETWEETED]->(tweet)
      WITH tweet, author, ru, postedOrRetweeted, posted, like, comment, retweet
      WHERE ru IS NULL OR ru.id <> author.id
      RETURN 
        tweet,
        author,
        ru AS retweetedBy,
        CASE type(postedOrRetweeted)
          WHEN 'POSTED' THEN tweet.createdAt
          WHEN 'RETWEETED' THEN postedOrRetweeted.retweetedAt        
        END AS tweetedAt,
        collect(DISTINCT like) as likes,
        collect(DISTINCT comment) as comments,
        collect(DISTINCT retweet) as retweets
      ORDER BY tweetedAt DESC
      SKIP $skip
      LIMIT $limit;
      `,
        { userId, ...pagination }
      );

      return result.records.map<Tweet>((r) => {
        const [
          tweet,
          author,
          retweetedBy,
          tweetedAt,
          likes,
          comments,
          retweets,
        ] = r.map((record) =>
          Array.isArray(record)
            ? Neo4jUtils.simplifyArrayResponse(record)
            : Neo4jUtils.simplifyResponse(record)
        );
        if (!tweet || !author || !tweetedAt || !likes || !comments || !retweets)
          throw new Error('could not retrieve tweets, invalid response');
        return {
          ...tweet,
          tweetedAt,
          author,
          retweetedBy: retweetedBy
            ? { userId: retweetedBy.id, name: retweetedBy.name }
            : null,
          likes,
          comments,
          retweets,
        } satisfies Tweet;
      });
    } catch (err) {
      throw err;
    } finally {
      session.close();
    }
  }

  export async function getComments({
    parentId,
    page = 1,
    limit = 10,
  }: OptionalPagination & {
    parentId: string;
  }): Promise<Tweet[]> {
    const session = db.session();
    const pagination = Neo4jUtils.pagination(page, limit);
    const response = await session.run(
      `
      MATCH (author:User)-[posted:POSTED]->(tweet:Tweet)-[:COMMENTS]->(parent:Tweet {id: $parentId})
      OPTIONAL MATCH (tweet)<-[like:LIKED]-(:User)
      OPTIONAL MATCH (comment:Tweet)-[:COMMENTS]->(tweet)
      OPTIONAL MATCH (tweet)<-[retweet:RETWEETED]-(:User)
      RETURN 
        tweet, 
        author, 
        posted, 
        collect(DISTINCT like) as likes, 
        collect(DISTINCT comment) as comments,
        collect(DISTINCT retweet) as retweets
        ORDER BY posted.createdAt DESC
      SKIP $skip 
      LIMIT $limit;
      `,
      { parentId, ...pagination }
    );

    return response.records.map(getTweetFromResponse);
  }

  export async function updateTweet({
    tweetId,
    message,
  }: {
    tweetId: string;
    message: string;
  }) {
    const session = db.session();
    await session.run(
      `
      MATCH (tweet:Tweet {id: $tweetId})
      SET tweet.message = $message;
      `,
      { message, tweetId }
    );

    await session.close();
  }

  export async function retweet({
    tweetId,
    userId,
  }: {
    tweetId: string;
    userId: string;
  }) {
    const session = db.session();
    await session.run(
      `
      MATCH (tweet:Tweet {id: $tweetId}), (user:User {id: $userId})
      CREATE (user)-[retweet:RETWEETED {id: randomUUID(), retweetedAt: datetime(), retweetedBy: user.id}]->(tweet);
      `,
      { tweetId, userId }
    );

    await session.close();
  }

  export async function removeRetweet({
    tweetId,
    userId,
  }: {
    tweetId: string;
    userId: string;
  }) {
    const session = db.session();
    await session.run(
      `
      MATCH (:User {id: $userId})-[retweet:RETWEETED]->(:Tweet {id: $tweetId})
      DELETE retweet;
      `,
      { tweetId, userId }
    );

    await session.close();
  }

  export async function getRetweetsUserIds(tweetId: string) {
    const session = db.session();
    const response = await session.run(
      `
      MATCH (:Tweet {id: $tweetId})<-[:RETWEETED]-(user:User)
      RETURN user.id as userId;
      `,
      { tweetId }
    );

    await session.close();

    return response.records.map<string>((r) => r.get('userId'));
  }

  function getTweetFromResponse(response: Record): Tweet {
    const tweet = Neo4jUtils.simplifyResponse<TweetNode>(response.get('tweet'));
    const author = Neo4jUtils.simplifyResponse<UserNode>(
      response.get('author')
    );
    const likes = Neo4jUtils.simplifyArrayResponse<LikedRelation>(
      response.get('likes')
    );
    const posted = Neo4jUtils.simplifyResponse<PostedRelation>(
      response.get('posted')
    );
    const comments = Neo4jUtils.simplifyArrayResponse<TweetNode>(
      response.get('comments')
    );
    const retweets = Neo4jUtils.simplifyArrayResponse<RetweetRelation>(
      response.get('retweets')
    );
    if (!tweet || !author || !likes || !posted || !retweets) {
      throw new Error('Failed to read response');
    }

    return {
      author,
      createdAt: posted.createdAt,
      id: tweet.id,
      message: tweet.message,
      retweetedBy: null,
      likes: likes.map((l) => ({ id: l.id, userId: l.likedBy })),
      retweets: retweets.map((r) => ({ id: r.id, userId: r.retweetedBy })),
      comments: comments.map((c) => ({ id: c.id })),
    };
  }
}
