import { AccountParams } from '@/app/api/user/[userId]/tweets/route';
import { auth } from '@/auth';
import { Prisma } from '@prisma/client';
import Filter from 'bad-words';
import z from 'zod';

import { AccountService } from '@/server/services/account.service';
import { ImageService } from '@/server/services/image.service';

import { ProfanityError, UnauthorizedError } from '@/lib/server';

import { NextRequest, NextResponse } from 'next/server';

const BadWordsFilter = new Filter();

const ImageSchema = z.object({
  data: z.string(),
  contentType: z.string(),
});

type Image = z.infer<typeof ImageSchema>;

const DateValidator = z
  .custom<Date>((v) => {
    if (typeof v === 'string') {
      const date = new Date(v);

      if (date.toString() !== 'Invalid Date') {
        return true;
      }
    }
    return false;
  }, 'must be a valid date string')
  .transform((v) => new Date(v));

const UpdateAccountSchema = z.object({
  name: z.string().min(3),
  image: ImageSchema.nullable(),
  background: ImageSchema.nullable(),
  born: DateValidator.optional(),
  location: z.string().optional(),
  description: z.string().optional(),
});

export type UpdateAccountDetailsBody = Pick<
  Prisma.UserUpdateInput,
  'born' | 'description' | 'location' | 'name'
> & {
  image: Image | null;
  background: Image | null;
};

export async function updateAccountDetailsControllerHandler(
  req: NextRequest,
  params: AccountParams
) {
  const { userId } = params;

  const session = await auth();

  if (!session?.user || userId !== session.user.id) {
    throw new UnauthorizedError();
  }

  const body = await req.json();
  const validatedBody = UpdateAccountSchema.parse(body);

  if (
    Object.values(validatedBody).some(
      (value) => typeof value === 'string' && BadWordsFilter.isProfane(value)
    )
  ) {
    throw new ProfanityError();
  }

  let backgroundImg: string | undefined;
  let profileImg: string | undefined;

  if (validatedBody.image) {
    const imgExtension = validatedBody.image.contentType.split('/')[1];
    const imgPath = `profile/${userId}.${imgExtension}`;

    profileImg = await ImageService.uploadImage(
      imgPath,
      validatedBody.image.data,
      validatedBody.image.contentType
    );
  }

  if (validatedBody.background) {
    const bgImageExtension = validatedBody.background.contentType.split('/')[1];
    const bgImagePath = `background/${userId}.${bgImageExtension}`;

    backgroundImg = await ImageService.uploadImage(
      bgImagePath,
      validatedBody.background.data,
      validatedBody.background.contentType
    );
  }

  const updatedUser = await AccountService.updateDetails({
    id: userId,
    background: backgroundImg,
    image: profileImg,
    born: validatedBody.born,
    name: validatedBody.name,
    location: validatedBody.location,
    description: validatedBody.description,
  });

  return NextResponse.json({
    message: 'User updated succesfully',
    data: { user: updatedUser },
  });
}
