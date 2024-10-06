import { StatusCodes } from 'http-status-codes';

export class ApiError extends Error {
  cause: string;
  status: number;

  constructor(e: any, status: number) {
    if (!isErrorResponse(e)) {
      super('Unexpected error from server');
      this.cause = e.message ?? 'Unknown cause';
      this.status = status ?? StatusCodes.INTERNAL_SERVER_ERROR;
    } else {
      super(e.message);
      this.cause = e.cause;
      this.status = status;
    }
  }
}

export type ErrorResponse = {
  message: string;
  cause: string;
};

function isErrorResponse(e: any): e is ErrorResponse {
  const message = e.message;
  const cause = e.cause;
  return typeof cause === 'string' && typeof message === 'string';
}
