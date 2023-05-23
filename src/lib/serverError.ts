import { NextResponse } from 'next/server';

export class HandledError extends Error {
  code: number = 500;

  constructor(code: number, message: string) {
    super(message);

    this.code = code;

    Object.setPrototypeOf(this, HandledError.prototype);
  }
}

export function ServerError(code: number, message: string) {
  return NextResponse.json(
    {},
    {
      status: code,
      statusText: message,
    }
  );
}
