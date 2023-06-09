'use client';

import { useMutation } from '@tanstack/react-query';
import { Calendar, PartyPopper, Pin } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react';

import { updateAccountDetails } from '../../services/Account.service';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import AccountSubInfo from '../account-sub-info/AccountSubInfo';

import { formatLongDate } from '@/lib/dateFormatters';
import { formatNumberToCompact } from '@/lib/shortNumberFormatter';

const DEFAULT_DESCRIPTION = "This user doesn't have a description";

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
  userId: string;
  image: string;
  description?: string | null;
  backgroundImage?: string;
  createdAt?: Date;
  born?: Date;
  location?: string;
  followersCount?: number;
  followingCount?: number;
}) {
  const { data: session } = useSession();

  const [newName, setNewName] = useState(name);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { mutate: updateUserInfo } = useMutation({
    mutationFn: async () =>
      await updateAccountDetails(userId, { name: newName }),
    mutationKey: ['updateAccountDetails'],
  });

  const isCurrentUsersPage = session?.user.id === userId;

  const showSubInfoTags = createdAt || born || location;

  return (
    <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
      <DialogContent>
        <label htmlFor="name">
          Name
          <input
            type="text"
            name="name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="bg-background rounded-lg border-muted border-2 p-1.5 outline-none"
          />
        </label>
        <button
          onClick={() => updateUserInfo()}
          className="bg-white text-background px-4 py-1.5 rounded-full font-bold"
        >
          Submit
        </button>
      </DialogContent>
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
                <DialogTrigger className="bg-white text-background px-4 py-1.5 rounded-full font-bold">
                  Edit Profile
                </DialogTrigger>
              )}
              {!isCurrentUsersPage && (
                <button className="bg-white active:bg-white/80 text-background px-4 py-1.5 rounded-full font-bold">
                  Follow
                </button>
              )}
            </div>
          </div>

          <div className={'flex flex-col text-lg leading-[22px]'}>
            <h5 className="whitespace-nowrap font-bold text-xl">{name}</h5>

            <span className="truncate text-gray-400 text-sm">{`@${email}`}</span>
          </div>
          <p className="text-base">{description ?? DEFAULT_DESCRIPTION}</p>

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
    </Dialog>
  );
}
