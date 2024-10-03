import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

import { NextRequest, NextResponse } from 'next/server';

export class ServerError extends Error {
  code: number;

  constructor({
    message,
    code = StatusCodes.INTERNAL_SERVER_ERROR,
  }: {
    message: string;
    code?: number;
  }) {
    super(message);
    this.code = code;

    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export class NotFoundError extends ServerError {
  constructor(message?: string) {
    super({ message: message ?? 'Not Found', code: StatusCodes.NOT_FOUND });
  }
}

export class UnauthorizedError extends ServerError {
  constructor() {
    super({
      message: 'User is not authenticated',
      code: StatusCodes.UNAUTHORIZED,
    });
  }
}

export class BadRequestError extends ServerError {
  constructor(message?: string) {
    super({ message: message ?? 'Bad Request', code: StatusCodes.BAD_REQUEST });
  }
}

export class ProfanityError extends ServerError {
  constructor() {
    super({
      message: 'Profanity is not allowed',
      code: StatusCodes.BAD_REQUEST,
    });
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
  if (e instanceof ZodError) {
    console.log(e);
    return nextServerErrorFactory({
      code: StatusCodes.BAD_REQUEST,
      message: 'Bad Request',
    });
  }
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

  console.log('Unexpected error: ', e);
  return nextServerErrorFactory({
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    message: 'Unexpected error occured, we are sorry!',
  });
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
