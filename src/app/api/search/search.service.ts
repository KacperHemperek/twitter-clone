import { User } from '@prisma/client';

import { ServerError } from '@/lib/server';

import { prisma } from '@/db/prisma';

const LIMIT = 10;

export async function searchUsers({
  searchQ,
  page,
  limit = LIMIT,
}: {
  searchQ: string;
  page: number;
  limit?: number;
}) {
  try {
    const results = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: searchQ } },
          { description: { contains: searchQ } },
        ],
      },
      select: {
        id: true,
        name: true,
        born: true,
        description: true,
        emailVerified: true,
        email: true,
        location: true,
        image: true,
        background: true,
        followers: {
          select: { id: true },
        },
        following: {
          select: { id: true },
        },
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    return results;
  } catch (e) {
    throw new ServerError({ code: 500, message: "Couldn't search users" });
  }
}

export type SearchUsersResult = Awaited<ReturnType<typeof searchUsers>>[number];

export async function searchTweets({
  page,
  searchQ,
  limit = LIMIT,
}: {
  searchQ: string;
  page: number;
  limit?: number;
}) {
  try {
    const results = await prisma.post.findMany({
      where: { message: { search: searchQ } },
      select: {
        message: true,
        author: {
          select: {
            email: true,
            name: true,
            id: true,
            image: true,
          },
        },
        createdAt: true,
        id: true,
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
        comments: {
          select: {
            id: true,
          },
        },
        retweets: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    });

    return results;
  } catch (e) {
    throw new ServerError({ code: 500, message: "Couldn't search tweets" });
  }
}
