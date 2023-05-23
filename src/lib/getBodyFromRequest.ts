import { NextRequest } from 'next/server';
import { ServerError } from './serverError';

export async function getBody(req: NextRequest | Request) {
  try {
    return await req.json();
  } catch (e) {
    throw new ServerError(400, "Couldn't retrive body from request");
  }
}
