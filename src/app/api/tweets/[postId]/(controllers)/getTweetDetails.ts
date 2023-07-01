import { NextResponse } from 'next/server';

import { getTweetDetails } from '../../(services)/tweet.service';

import {
  ServerError,
  handleServerError,
  nextServerErrorFactory,
} from '@/lib/serverError';

export async function getTweetDetailsController(tweetId: string) {
  if (!tweetId) {
    return nextServerErrorFactory(400, "Didn't find id in request");
  }

  try {
    const tweetDetails = await getTweetDetails(tweetId);

    if (!tweetDetails) {
      throw new ServerError(404, "Couldn't find tweet with given id");
    }

    return NextResponse.json(tweetDetails);
  } catch (e) {
    return handleServerError(e);
  }
}
