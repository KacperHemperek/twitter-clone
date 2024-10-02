import { AccountDetails } from '@/types/AccountDetails.type';

import { Neo4jUtils } from '@/utils/neo4j';

import { UserNode, db } from '@/server';

export module AccountService {
  export const getDetailsById = async (
    userId: string
  ): Promise<AccountDetails> => {
    const session = db.session();
    try {
      const response = await session.run(
        `
      MATCH (account:User {id: $userId })
      RETURN account;   
      `,
        {
          userId,
        }
      );

      const account = Neo4jUtils.simplifyResponse<UserNode>(
        response.records[0].get('account')
      );

      if (!account) {
        throw new Error('Failed to read comment response');
      }

      return {
        ...account,
        followers: [],
        following: [],
      };
    } catch (err) {
      throw err;
    } finally {
      await session.close();
    }
  };

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
        CREATE (follower)-[follow:FOLLOWS { id: randomUUID(), followedAt: datatime(), followeeId: followee.id, followerId: follower.id }]->(followee);
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
