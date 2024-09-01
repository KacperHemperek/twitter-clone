import { NextRequest, NextResponse } from 'next/server';

export class ServerError extends Error {
  code: number;

  constructor({ message, code = 500 }: { message: string; code?: number }) {
    super(message);
    this.code = code;

    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export class NotFoundError extends ServerError {
  constructor(message?: string) {
    super({ message: message ?? 'Not Found', code: 404 });
  }
}

export class UnauthorizedError extends ServerError {
  constructor() {
    super({ message: 'User is not authenticated', code: 403 });
  }
}

export class BadRequestError extends ServerError {
  constructor(message?: string) {
    super({ message: message ?? 'Bad Request', code: 400 });
  }
}

export class ProfanityError extends ServerError {
  constructor() {
    super({ message: 'Profanity is not allowed', code: 400 });
  }
}

export function nextServerErrorFactory({
  code,
  message = 'Unexpected Server Error',
}: {
  code: number;
  message?: string;
}) {
  return NextResponse.json(
    { message },
    {
      status: code,
    }
  );
}

export function handleServerError(e: any) {
  console.error('Error caught in server handler');
  if (e.code) {
    console.error('Code: ', e.code);
  }
  if (e.message) {
    console.error('Message: ', e.message);
  }
  if (e.cause) {
    console.error('Cause: ', e.cause);
  }
  if (e instanceof ServerError) {
    return nextServerErrorFactory({
      code: e.code,
      message: e.message,
    });
  }
  return nextServerErrorFactory({ code: 500, message: e?.message });
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
