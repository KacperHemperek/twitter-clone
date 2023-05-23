import { NextResponse } from 'next/server';

export class ServerError extends Error {
  code: number = 500;

  constructor(code: number, message: string) {
    super(message);

    this.code = code;

    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export function getNextServerError(
  code: number,
  message: string = 'Unexpected Server Error'
) {
  return NextResponse.json(
    {},
    {
      status: code,
      statusText: message,
    }
  );
}
