import { getImageController } from '@/app/api/images/[...path]/images.controller';
import { NextRequest, NextResponse } from 'next/server';

import { apiHandler } from '@/lib/server';

export const GET = async (req: NextRequest, params: { path: string[] }) => {
  return apiHandler(getImageController, req, { params });
};
