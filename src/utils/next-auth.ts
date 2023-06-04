import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { type NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

import { prisma } from '@/db/prisma';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session: async ({ token, session }) => {
      if (token) {
        session.user.id = token.id as string;
      }

      return session;
    },
    redirect: async ({ baseUrl }) => {
      return baseUrl + '/feed/main';
    },
  },

  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
};
