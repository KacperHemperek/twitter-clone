import { NextRequest, NextResponse } from 'next/server';

export class ServerError extends Error {
  code: number;

  constructor({ message, code = 500 }: { message: string; code?: number }) {
    super(message);
    this.code = code;

    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export function nextServerErrorFactory(
  code: number,
  message: string = 'Unexpected Server Error',
  cause: string = 'Unknown error occurred. Sorry for the inconvenience.'
) {
  return NextResponse.json(
    { message, cause },
    {
      status: code,
    }
  );
}

export function ThrowProfanityError() {
  throw new ServerError({
    message: "You kiss your mother with that mouth?! Don't use profanity!",
    code: 400,
  });
}

export function handleServerError(e: any) {
  if (e instanceof ServerError) {
    console.error(e?.cause ?? '');
    console.error(e?.message ?? '');
    if (e.code === 400) {
      return nextServerErrorFactory(
        e.code,
        e.message,
        'Bad Request - Invalid user input'
      );
    }

    if (e.code === 401) {
      return nextServerErrorFactory(
        e.code,
        e.message,
        'Unauthorized - User is not authenticated'
      );
    }

    if (e.code === 404) {
      return nextServerErrorFactory(
        e.code,
        e.message,
        'Not Found - Resource not found'
      );
    }

    return nextServerErrorFactory(500, 'Internal Server Error', e.message);
  }
  return nextServerErrorFactory(500, e?.message);
}
export const apiHandler = async (
  fn: (req: NextRequest, params: any) => Promise<NextResponse | Response>,
  req: NextRequest,
  params?: { params: any }
) => {
  try {
    return await fn(req, params?.params);
  } catch (e) {
    return handleServerError(e);
  }
};
