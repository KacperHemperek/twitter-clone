import { authOptions } from '@/utils/next-auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { createComment } from '../(services)/comments.services';

import { getBody } from '@/lib/getBodyFromRequest';
import { ServerError, handleServerError } from '@/lib/serverError';

export async function addCommentHandler(req: NextRequest, tweetId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new ServerError(403, 'User is not authenticated');
    }

    const body: { tweetBody?: string } = await getBody(req);

    if (!body.tweetBody) {
      throw new ServerError(400, 'Wrong tweetBody required');
    }

    await createComment({
      authorId: session.user.id,
      message: body.tweetBody,
      parentId: tweetId,
    });

    return NextResponse.json({ message: 'Comment createed succesfully' });
  } catch (e) {
    handleServerError(e);
  }
}
