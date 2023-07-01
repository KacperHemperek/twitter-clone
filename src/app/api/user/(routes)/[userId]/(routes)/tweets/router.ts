import { NextRequest } from 'next/server';

type AccountParams = {
  userId: string;
};

export function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: AccountParams;
  }
) {
  console.log('getting users tweets');
}
