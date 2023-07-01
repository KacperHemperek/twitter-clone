import { NextRequest } from 'next/server';

type ArrayToObject<T extends string[]> = { [K in T[number]]: string | null };

export function getServerSearchParams<T extends string[]>(
  req: NextRequest | Request,
  params: T
): ArrayToObject<T> {
  const { searchParams } = new URL(req.url);

  const result = {} as ArrayToObject<T>;

  for (const param of params) {
    const value = searchParams.get('page');

    result[param as T[number]] = value;
  }

  return result;
}

export function getPageNumber(page: string | null) {
  return !!Number(page) ? Number(page) : 1;
}
