import neo4j, { Record } from 'neo4j-driver';

import { Tweet } from '@/types/Tweet.type';

import { debugLog } from '@/utils/debug';
import { Neo4jUtils } from '@/utils/neo4j';

import {
  LikedRelation,
  PostedRelation,
  TweetNode,
  UserNode,
  db,
} from '@/server';

export module TweetsService {
  export async function getHomePageTweets(
    props: {
      page: number;
      limit: number;
    } = { page: 1, limit: 10 }
  ): Promise<Tweet[]> {
    const session = db.session();
    const skip = neo4j.int((props.page - 1) * props.limit);
    const limit = neo4j.int(props.limit);

    const response = await session.run(
      `
      MATCH (tweet:Tweet)<-[posted:POSTED]-(author:User)
      WHERE NOT (tweet)-[:COMMENTS]->(:Tweet)
      OPTIONAL MATCH (tweet)<-[like:LIKED]-(:User)
      OPTIONAL MATCH (comment:Tweet)-[:COMMENTS]->(tweet)
      RETURN tweet, author, posted, collect(DISTINCT like) as likes, collect(DISTINCT comment) as comments ORDER BY posted.createdAt DESC
      SKIP $skip 
      LIMIT $limit;
      `,
      { skip, limit }
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
        CREATE (author)-[posted:POSTED {createdAt: datetime()}]->(tweet:Tweet {id: randomUUID(), message: $message})
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
      RETURN tweet, author, posted, collect(DISTINCT like) as likes, collect(DISTINCT comment) as comments;
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

  export async function getComments({
    parentId,
    page = 1,
    limit = 10,
  }: {
    parentId: string;
    page?: number;
    limit?: number;
  }): Promise<Tweet[]> {
    const session = db.session();
    const skip = neo4j.int((page - 1) * limit);
    const response = await session.run(
      `
      MATCH (author:User)-[posted:POSTED]->(tweet:Tweet)-[:COMMENTS]->(parent:Tweet {id: $parentId})
      OPTIONAL MATCH (tweet)<-[like:LIKED]-(:User)
      OPTIONAL MATCH (comment:Tweet)-[:COMMENTS]->(tweet)
      RETURN tweet, author, posted, collect(DISTINCT like) as likes, collect(DISTINCT comment) as comments ORDER BY posted.createdAt DESC
      SKIP $skip 
      LIMIT $limit;
      `,
      { parentId, skip, limit: neo4j.int(limit) }
    );

    return response.records.map(getTweetFromResponse);
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
    if (!tweet || !author || !likes || !posted) {
      throw new Error('Failed to read response');
    }

    return {
      author,
      createdAt: posted.createdAt,
      id: tweet.id,
      message: tweet.message,
      retweetedBy: null,
      likes: likes.map((l) => ({ id: l.id, userId: l.likedBy })),
      retweets: [],
      comments: comments.map((c) => ({ id: c.id })),
    };
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
}
