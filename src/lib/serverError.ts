import { NextResponse } from 'next/server';

export class ServerError extends Error {
  code: number = 500;

  constructor(code: number, message: string) {
    super(message);

    this.code = code;

    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export function nextServerErrorFactory(
  code: number,
  message: string = 'Unexpected Server Error'
) {
  return NextResponse.json(
    { message: message },
    {
      status: code,
    }
  );
}

export function ThrowProfanityError() {
  throw new ServerError(
    400,
    "You kiss your mother with that mouth?! Don't use profanity!"
  );
}

export function handleServerError(e: any) {
  if (e instanceof ServerError) {
    return nextServerErrorFactory(e.code, e.message);
  }
  return nextServerErrorFactory(500, e?.message);
}
