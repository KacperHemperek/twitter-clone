import { ServerError } from './server';
import { NextApiRequest } from 'next';
import { NextRequest } from 'next/server';

export async function getBody(req: NextRequest | Request | NextApiRequest) {
  try {
    if (req instanceof NextRequest || req instanceof Request) {
      return await req.json();
    } else {
      return req.body;
    }
  } catch (e) {
    throw new ServerError({
      code: 400,
      message: "Couldn't retrive body from request",
    });
  }
}
