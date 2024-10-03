import { FollowRelation } from '../relations';

import { Neo4jUtils } from '@/utils/neo4j';

import { db } from '@/server';

export module FollowService {
  export async function getUserFolloweeIds(userId: string): Promise<string[]> {
    const session = db.session();
    try {
      const response = await session.run(
        `
      MATCH (u: User { id: $userId })-[follow:FOLLOWS]->(:User)
      RETURN collect(DISTINCT follow) as follows;
      `,
        { userId }
      );

      const follows = Neo4jUtils.simplifyArrayResponse<FollowRelation>(
        response.records[0].get('follows')
      );
      return follows.map((f) => f.followeeId);
    } catch (err) {
      throw err;
    } finally {
      session.close();
    }
  }

  export async function getUserFollowerIds(userId: string): Promise<string[]> {
    const session = db.session();
    try {
      const response = await session.run(
        `
      MATCH (u: User { id: $userId })<-[follow:FOLLOWS]-(:User)
      RETURN collect(DISTINCT follow) as follows;
      `,
        { userId }
      );

      const follows = Neo4jUtils.simplifyArrayResponse<FollowRelation>(
        response.records[0].get('follows')
      );
      return follows.map((f) => f.followerId);
    } catch (err) {
      throw err;
    } finally {
      session.close();
    }
  }

  export const followUser = async ({
    followeeId,
    followerId,
  }: {
    followerId: string;
    followeeId: string;
  }) => {
    const session = db.session();
    try {
      await session.run(
        `
        MATCH (follower: User {id: $followerId}), (followee: User {id: $followeeId })
        CREATE (follower)-[follow:FOLLOWS { id: randomUUID(), followedAt: datetime(), followeeId: followee.id, followerId: follower.id }]->(followee);
        `,
        { followerId, followeeId }
      );
    } catch (err) {
      throw err;
    } finally {
      session.close();
    }
  };

  export const unfollowUser = async ({
    followeeId,
    followerId,
  }: {
    followerId: string;
    followeeId: string;
  }) => {
    const session = db.session();
    try {
      await session.run(
        `
        MATCH (follower: User {id: $followerId})-[follow:FOLLOWS]->(followee: User {id: $followeeId })
        DELETE follow; 
        `,
        { followerId, followeeId }
      );
    } catch (err) {
      throw err;
    } finally {
      session.close();
    }
  };
}
