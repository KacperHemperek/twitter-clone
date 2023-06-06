'use client';

import { Calendar, PartyPopper, Pin } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';

import AccountSubInfo from '../account-sub-info/AccountSubInfo';

import { formatLongDate } from '@/lib/dateFormatters';
import { formatNumberToCompact } from '@/lib/shortNumberFormatter';

export default function AccountDetails({
  name,
  email,
  userId,
  description,
  image,
  born,
  createdAt,
  location,
  followersCount = 0,
  backgroundImage = 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  followingCount = 0,
}: {
  name: string;
  email: string;
  description: string;
  userId: string;
  image: string;
  backgroundImage?: string;
  createdAt?: Date;
  born?: Date;
  location?: string;
  followersCount?: number;
  followingCount?: number;
}) {
  const { data: session } = useSession();

  const isCurrentUsersPage = session?.user.id === userId;

  const showSubInfoTags = createdAt || born || location;

  return (
    <div className="flex flex-col">
      <div className="aspect-[3/1] w-full relative">
        <Image
          src={backgroundImage}
          fill={true}
          className="object-cover "
          alt={'background image of a user'}
          placeholder="blur"
          blurDataURL="https://images.unsplash.com/photo-1509023464722-18d996393ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        />
      </div>
      <div className="flex flex-col gap-4 sm:gap-8 p-4">
        <div className="flex justify-between relative">
          <div />
          <div className="p-1 bg-background rounded-full absolute -translate-y-[60%] max-w-[128px] min-w-[84px] w-1/4 aspect-square">
            <Avatar className="w-full h-full">
              <AvatarImage src={image} />
            </Avatar>
          </div>
          <div className="flex flex-row gap-2">
            {isCurrentUsersPage && (
              <button className="bg-white text-background px-4 py-1.5 rounded-full font-bold">
                Edit Profile
              </button>
            )}
            {!isCurrentUsersPage && (
              <button className="bg-white text-background px-4 py-1.5 rounded-full font-bold">
                Follow
              </button>
            )}
          </div>
        </div>

        <div className={'flex flex-col text-lg leading-[22px]'}>
          <h5 className="whitespace-nowrap font-bold text-xl">{name}</h5>

          <span className="truncate text-gray-400 text-sm">{`@${email}`}</span>
        </div>
        <p className="text-base">{description}</p>

        {showSubInfoTags && (
          <div className="flex flex-wrap text-gray-400 gap-x-3 gap-y-1.5">
            {createdAt && (
              <AccountSubInfo
                text={`joined ${formatLongDate(createdAt)}`}
                icon={<Calendar className="w-full h-full" />}
              />
            )}

            {location && (
              <AccountSubInfo
                text={location}
                icon={<Pin className="w-full h-full" />}
              />
            )}
            {born && (
              <AccountSubInfo
                text={`Born ${formatLongDate(born)}`}
                icon={<PartyPopper className="w-full h-full" />}
              />
            )}
          </div>
        )}

        <div className="flex gap-3">
          <p className="text-sm text-gray-400">
            <span className="text-white font-semibold">
              {`${formatNumberToCompact(followingCount)} `}
            </span>{' '}
            Following
          </p>
          <p className="text-sm text-gray-400">
            <span className="text-white font-semibold">
              {`${formatNumberToCompact(followersCount)} `}
            </span>
            Followers
          </p>
        </div>
      </div>
    </div>
  );
}
