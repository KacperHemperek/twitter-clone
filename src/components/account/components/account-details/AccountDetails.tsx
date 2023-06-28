'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { getMonth, setYear } from 'date-fns';
import { CalendarIcon, PartyPopper, Pin } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useMemo, useRef, useState } from 'react';

import {
  getAccoundDetails,
  updateAccountDetails,
} from '../../services/Account.service';

import Input from '@/components/common/Input';
import { queryClient } from '@/components/context/Providers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import AccountSubInfo from '../account-sub-info/AccountSubInfo';

import { formatTweetDate, getMonthName } from '@/lib/dateFormatters';
import { formatNumberToCompact } from '@/lib/shortNumberFormatter';

import { type AccountDetails as AccountDetailsType } from '@/types/AccountDetails.type';

const DEFAULT_DESCRIPTION = "This user doesn't have a description";

const ACCOUNT_DETAILS_KEY = ['accountDetails'];

const getInitialBirthdayState = (birthday: Date) => {
  const bithdayDate = new Date(birthday);

  const day = bithdayDate.getDate();
  const month = bithdayDate.getMonth();
  const year = bithdayDate.getFullYear();

  return { day, month, year };
};

export default function AccountDetails({
  initialAccountDetails,
}: {
  initialAccountDetails: AccountDetailsType;
}) {
  const { data: session } = useSession();

  const { data: accountDetails } = useQuery({
    queryFn: () => getAccoundDetails(initialAccountDetails.id),
    queryKey: ACCOUNT_DETAILS_KEY,
    initialData: initialAccountDetails,
  });

  const [newName, setNewName] = useState(accountDetails?.name ?? '');
  const [newDescription, setNewDescription] = useState(
    accountDetails?.description ?? ''
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newBirthday, setNewBirthday] = useState<{
    day: number;
    month: number;
    year: number;
  }>(
    accountDetails.born
      ? getInitialBirthdayState(accountDetails.born)
      : { day: 0, month: 0, year: new Date().getFullYear() }
  );

  const currentDaysInMonth = useMemo(
    () => new Date(newBirthday.year, newBirthday.month + 1, 0).getDate(),
    [newBirthday.year, newBirthday.month]
  );

  const { mutate: updateUserInfo, isLoading: updatingUser } = useMutation({
    mutationFn: async () =>
      await updateAccountDetails(initialAccountDetails.id, {
        name: newName,
        description: newDescription,
      }),
    mutationKey: ['updateAccountDetails'],
    onSuccess: () => {
      queryClient.invalidateQueries(ACCOUNT_DETAILS_KEY);

      setEditModalOpen(false);
    },
  });

  const isCurrentUsersPage = session?.user.id === accountDetails?.id;

  const showSubInfoTags = !!accountDetails?.born || !!accountDetails?.location;

  return (
    <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
      <DialogContent className="h-full flex flex-col sm:h-min">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
        </DialogHeader>
        <Input
          value={newName}
          setValue={setNewName}
          limitCharacters={50}
          name="name"
          placeholder="Name"
        />
        <Input
          value={newDescription}
          setValue={setNewDescription}
          limitCharacters={160}
          name="description"
          placeholder="Description"
          type="textarea"
        />

        <div className="flex items-center gap-4">
          <Select
            onValueChange={(month) =>
              setNewBirthday((prevDate) => ({
                ...prevDate,
                month: Number(month),
              }))
            }
            value={String(newBirthday.month)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="max-h-40 overflow-y-scroll">
              {[...Array(12)].map((_, index) => (
                <SelectItem key={index} value={String(index)}>
                  {getMonthName(index)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(day) =>
              setNewBirthday((prevDate) => ({
                ...prevDate,
                day: Number(day),
              }))
            }
            value={String(newBirthday.day)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent className="max-h-40 overflow-y-scroll">
              {[...Array(currentDaysInMonth)].map((_, index) => (
                <SelectItem key={index} value={String(index)}>
                  {index + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(year) =>
              setNewBirthday((prevDate) => ({
                ...prevDate,
                year: Number(year),
              }))
            }
            value={String(newBirthday.year)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="max-h-40 overflow-y-scroll">
              {[...Array(110)].map((_, index) => (
                <SelectItem
                  key={index}
                  value={String(new Date().getFullYear() - index)}
                >
                  {String(new Date().getFullYear() - index)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button
          onClick={() => updateUserInfo()}
          className={
            'bg-white text-background px-4 py-1.5 rounded-full font-bold transition-colors disabled:bg-white/50'
          }
          disabled={updatingUser}
        >
          Submit
        </button>
      </DialogContent>
      <div className="flex flex-col">
        <div className="aspect-[3/1] w-full relative">
          <Image
            src={
              'https://images.unsplash.com/photo-1509023464722-18d996393ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
            }
            fill={true}
            className="object-cover "
            alt={'background image of a user'}
            placeholder="blur"
            blurDataURL="https://images.unsplash.com/photo-1509023464722-18d996393ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          />
        </div>
        <div className="flex flex-col gap-4 sm:gap-4 p-4">
          <div className="flex justify-between relative sm:mb-4">
            <div />
            <div className="p-1 bg-background rounded-full absolute -translate-y-[60%] max-w-[128px] min-w-[84px] w-1/4 aspect-square">
              <Avatar className="w-full h-full">
                <AvatarImage src={accountDetails?.image ?? ''} />
                <AvatarFallback className="text-xl">
                  {accountDetails?.name?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-row gap-2">
              {isCurrentUsersPage && (
                <DialogTrigger className="bg-background text-white hover:bg-white/10 transition-all px-4 py-1.5 rounded-full font-bold border border-white">
                  Edit Profile
                </DialogTrigger>
              )}
              {!isCurrentUsersPage && (
                <button className="bg-white active:bg-white/80 text-background px-4 py-1.5 rounded-full font-bold border-2 border-white">
                  Follow
                </button>
              )}
            </div>
          </div>

          <div className={'flex flex-col text-lg leading-[22px]'}>
            <h5 className="whitespace-nowrap font-bold text-xl">
              {accountDetails?.name}
            </h5>

            <span className="truncate text-gray-400 text-sm">{`@${accountDetails?.email}`}</span>
          </div>
          <p className="text-base">
            {accountDetails?.description || !!accountDetails.description?.length
              ? accountDetails.description
              : DEFAULT_DESCRIPTION}
          </p>

          {showSubInfoTags && (
            <div className="flex flex-wrap text-gray-400 gap-x-3 gap-y-1.5">
              {accountDetails?.location && (
                <AccountSubInfo
                  text={accountDetails?.location ?? ''}
                  icon={<Pin className="w-full h-full" />}
                />
              )}
              {accountDetails?.born && (
                <AccountSubInfo
                  text={`Born ${formatTweetDate(
                    new Date(accountDetails.born)
                  )}`}
                  icon={<PartyPopper className="w-full h-full" />}
                />
              )}
            </div>
          )}

          <div className="flex gap-3">
            <p className="text-sm text-gray-400">
              <span className="text-white font-semibold">
                {`${formatNumberToCompact(
                  accountDetails?.followingCount ?? 0
                )} `}
              </span>{' '}
              Following
            </p>
            <p className="text-sm text-gray-400">
              <span className="text-white font-semibold">
                {`${formatNumberToCompact(
                  accountDetails?.followersCount ?? 0
                )} `}
              </span>
              Followers
            </p>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
