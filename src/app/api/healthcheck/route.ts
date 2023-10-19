import { NextRequest, NextResponse } from 'next/server';

import { getBody } from '@/lib/getBodyFromRequest';
import { apiHandler } from '@/lib/server';

import { prisma } from '@/db/prisma';

async function checkKey(key: string) {
  if (!process.env.HEALTHCHECK_SECRET) {
    return false;
  }

  return process.env.HEALTHCHECK_SECRET === key;
}

async function checkDb() {
  try {
    const result = await prisma.post.findFirst();

    return result;
  } catch (e) {
    return undefined;
  }
}

export async function POST(req: NextRequest) {
  return apiHandler(async (req) => {
    const { key } = await getBody(req);

    if (!key) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'No key provided',
        },
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const keyCheckResult = await checkKey(key);

    if (!keyCheckResult) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Key is invalid',
        },
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const dbCheckResult = await checkDb();

    console.log(process.env.HEALTHCHECK_SECRET);

    if (!dbCheckResult) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Database is not connected',
        },
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return NextResponse.json(
      {
        status: 'ok',
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }, req);
}
