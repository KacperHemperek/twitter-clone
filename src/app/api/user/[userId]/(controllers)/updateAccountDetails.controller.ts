import { AccountParams } from '@/app/api/user/[userId]/tweets/route';
import { authOptions } from '@/utils/next-auth';
import { Prisma } from '@prisma/client';
import Filter from 'bad-words';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { updateAccountDetailsById } from '../(services)/account.service';
import { uploadImage } from '@/app/api/images/[...path]/images.services';

import { ThrowProfanityError, nextServerErrorFactory } from '@/lib/server';

const BadWordsFilter = new Filter();

export type UpdateAccountDetailsBody = Pick<
  Prisma.UserUpdateInput,
  'born' | 'description' | 'location' | 'name'
> & {
  image: {
    data: string;
    contentType: string;
  } | null;
  background: {
    data: string;
    contentType: string;
  } | null;
};

export async function updateAccountDetailsControllerHandler(
  req: NextRequest,
  params: AccountParams
) {
  const { userId } = params;

  const session = await getServerSession(authOptions);

  if (!session?.user || userId !== session.user.id) {
    return nextServerErrorFactory(
      403,
      'This user is unauthorized to update account details'
    );
  }

  const body: UpdateAccountDetailsBody = await req.json();

  const { image, background, ...restOfBody } = body;
  let backgroundImg: string | undefined;
  let profileImg: string | undefined;

  if (body.image) {
    const imgExtension = body.image.contentType.split('/')[1];
    const imgPath = `profile/${userId}.${imgExtension}`;

    profileImg = await uploadImage(
      imgPath,
      body.image.data,
      body.image.contentType
    );
  }

  if (body.background) {
    const bgImageExtension = body.background.contentType.split('/')[1];
    const bgImagePath = `background/${userId}.${bgImageExtension}`;

    backgroundImg = await uploadImage(
      bgImagePath,
      body.background.data,
      body.background.contentType
    );
  }

  if (
    Object.values(body).some(
      (value) => typeof value === 'string' && BadWordsFilter.isProfane(value)
    )
  ) {
    ThrowProfanityError();
  }

  const updatedUser = await updateAccountDetailsById(userId, {
    ...restOfBody,
    background: backgroundImg,
    image: profileImg,
  });

  return NextResponse.json({
    message: 'User updated succesfully',
    data: { user: updatedUser },
  });
}
