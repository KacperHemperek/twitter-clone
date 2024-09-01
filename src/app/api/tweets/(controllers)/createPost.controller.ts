import { auth } from '@/auth';
import { TweetsService } from '@/server';
import Filter from 'bad-words';
import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

import { getBody } from '@/lib/getBodyFromRequest';
import {
  ServerError,
  ThrowProfanityError,
  nextServerErrorFactory,
} from '@/lib/server';

const BadWordFilter = new Filter();

export async function createPostController(req: NextApiRequest) {
  const session = await auth();

  if (!session) {
    return nextServerErrorFactory(403, 'User is not authenticated');
  }

  const userId = session.user.id;
  const body: { tweetBody?: string } = await getBody(req);

  if (!body?.tweetBody) {
    throw new ServerError({
      code: 400,
      message: 'Tweet body must not be empty',
    });
  }

  if (BadWordFilter.isProfane(body.tweetBody)) {
    ThrowProfanityError();
  }

  await TweetsService.createTweet({
    message: body.tweetBody,
    userId,
  });
  // const newTweet = await createTweet(body.tweetBody, userId);

  return NextResponse.json({ data: 'OK' });
  // return NextResponse.json({ data: { createdPost: newTweet } });
}
