import { types as neo4jTypes } from 'neo4j-driver';

import { AccountDetails } from '@/types/AccountDetails.type';

import { Neo4jUtils } from '@/utils/neo4j';

import { UserNode, db } from '@/server';

type UpdateAccountDetails = Omit<UserNode, 'email' | 'emailVerified'>;

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

  export async function updateDetails({
    id,
    ...details
  }: UpdateAccountDetails) {
    const session = db.session();
    console.log(details);
    try {
      const response = await session.run(
        `
      MATCH (account:User { id: $userId })
      SET account.name = coalesce($name, account.name)
      SET account.description = coalesce($description, account.description)
      SET account.born = coalesce($born, account.born)
      SET account.location = coalesce($location, account.location)
      SET account.image = coalesce($image, account.image)
      SET account.background = coalesce($background, account.background)
      RETURN account;`,
        {
          userId: id,
          name: details.name ?? null,
          description: details.description ?? null,
          born: details.born
            ? neo4jTypes.Date.fromStandardDate(details.born)
            : null,
          location: details.location ?? null,
          image: details.image ?? null,
          background: details.background ?? null,
        }
      );

      const account = Neo4jUtils.simplifyResponse<UserNode>(
        response.records[0].get('account')
      );

      if (!account) {
        throw new Error('Failed to retrieve updated account');
      }

      return account;
    } catch (err) {
      throw err;
    } finally {
      session.close();
    }
  }
}
