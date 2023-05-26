import { ServerError } from './serverError';
import { NextRequest } from 'next/server';

export async function getBody(req: NextRequest | Request) {
  try {
    return await req.json();
  } catch (e) {
    throw new ServerError(400, "Couldn't retrive body from request");
  }
}
