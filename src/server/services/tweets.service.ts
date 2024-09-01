import {
  LikedRelation,
  PostedRelation,
  TweetNode,
  UserNode,
  db,
} from '@/server';
import { Neo4jUtils } from '@/utils/neo4j';
import neo4j from 'neo4j-driver';

import { Tweet } from '@/types/Tweet.type';

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
      OPTIONAL MATCH (tweet)<-[like:LIKED]-(:User)
      RETURN tweet, author, posted, collect(like) as likes ORDER BY posted.createdAt DESC
      SKIP $skip 
      LIMIT $limit;
      `,
      { skip, limit }
    );

    await session.close();

    return response.records.map<Tweet>((r) => {
      const tweet = Neo4jUtils.simplifyResponse<TweetNode>(r.get('tweet'));
      const author = Neo4jUtils.simplifyResponse<UserNode>(r.get('author'));
      const likes = Neo4jUtils.simplifyArrayResponse<LikedRelation>(
        r.get('likes')
      );
      const posted = Neo4jUtils.simplifyResponse<PostedRelation>(
        r.get('posted')
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
        comments: [],
      };
    });
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
        MATCH (u:User {id: $userId})
        CREATE (u)-[p:POSTED {createdAt: datetime()}]->(t:Tweet {id: randomUUID(), message: $message})
        RETURN t, p, u;
        `,
      { userId, message }
    );
    const tweetResponse = Neo4jUtils.simplifyResponse<TweetNode>(
      response.records[0].get('t')
    );
    const relationResponse = Neo4jUtils.simplifyResponse<PostedRelation>(
      response.records[0].get('p')
    );
    const userResponse = Neo4jUtils.simplifyResponse<UserNode>(
      response.records[0].get('u')
    );

    if (!tweetResponse || !relationResponse || !userResponse) {
      throw new Error('Failed to read response');
    }

    await session.close();

    return {
      tweetedAt: relationResponse.createdAt,
      createdAt: relationResponse.createdAt,
      author: {
        name: userResponse.name,
        email: userResponse.email,
        id: userResponse.id,
        image: userResponse.image,
      },
      id: tweetResponse.id,
      message: tweetResponse.message,
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
      RETURN tweet, author, posted, collect(like) as likes
      `,
      { tweetId }
    );

    const tweet = Neo4jUtils.simplifyResponse<TweetNode>(
      response.records[0].get('tweet')
    );
    const author = Neo4jUtils.simplifyResponse<UserNode>(
      response.records[0].get('author')
    );
    const likes = Neo4jUtils.simplifyArrayResponse<LikedRelation>(
      response.records[0].get('likes')
    );
    const posted = Neo4jUtils.simplifyResponse<PostedRelation>(
      response.records[0].get('posted')
    );
    if (!tweet || !author || !likes || !posted) {
      throw new Error('Failed to read tweet response');
    }

    return {
      author,
      createdAt: posted.createdAt,
      id: tweet.id,
      message: tweet.message,
      retweetedBy: null,
      likes: likes.map((l) => ({ id: l.id, userId: l.likedBy })),
      retweets: [],
      comments: [],
    };
  }
}
