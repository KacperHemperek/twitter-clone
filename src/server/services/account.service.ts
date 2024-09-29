import { Neo4jUtils } from "@/utils/neo4j";
import { AccountDetails } from "@/types/AccountDetails.type";
import { UserNode, db } from "@/server";

export module AccountService {
  export const getDetailsById = async (userId: string): Promise<AccountDetails> => {
    const session = db.session();

    const response = await session.run(
      `
      MATCH (account:User {id: $userId })
      RETURN account;   
      `,
      {
        userId
      }
    );

    const account = Neo4jUtils.simplifyResponse<UserNode>(
      response.records[0].get('account')
    )

    if (!account) {
      throw new Error('Failed to read comment response');
    }

    await session.close();

    return {
      ...account,
      followers: [],
      following: [],
    }
  }
}
