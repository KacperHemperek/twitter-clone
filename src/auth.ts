import { db } from '@/server';
import Discord from '@auth/core/providers/discord';
import Google from '@auth/core/providers/google';
import { Neo4jAdapter } from '@auth/neo4j-adapter';
import NextAuth, { NextAuthConfig } from 'next-auth';

export const config: NextAuthConfig = {
  session: {
    strategy: 'jwt',
  },
  adapter: Neo4jAdapter(db.session()),
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
  pages: {
    signIn: '/login',
  },
  providers: [
    Discord,
    Google({
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
};

export const { signIn, signOut, auth, handlers } = NextAuth(config);
