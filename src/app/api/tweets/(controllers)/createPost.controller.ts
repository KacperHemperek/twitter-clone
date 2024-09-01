import { auth } from '@/auth';
import { TweetsService } from '@/server';
import Filter from 'bad-words';
import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

import { getBody } from '@/lib/getBodyFromRequest';
import {
  BadRequestError,
  ProfanityError,
  UnauthorizedError,
} from '@/lib/server';

const BadWordFilter = new Filter();

export async function createPostController(req: NextApiRequest) {
  const session = await auth();

  if (!session) {
    throw new UnauthorizedError();
  }

  const userId = session.user.id;
  const body: { tweetBody?: string } = await getBody(req);

  if (!body?.tweetBody) {
    throw new BadRequestError('Tweet body must not be empty');
  }

  if (BadWordFilter.isProfane(body.tweetBody)) {
    throw new ProfanityError();
  }

  const tweet = await TweetsService.createTweet({
    message: body.tweetBody,
    userId,
  });

  return NextResponse.json({ data: { createdPost: tweet } });
}
