'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { getDaysInMonth, isBefore } from 'date-fns';
import { PartyPopper, Pin } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';

import {
  getAccoundDetails,
  updateAccountDetails,
} from '@/services/Account.service';

import AccountSubInfo from '@/components/account/account-sub-info/AccountSubInfo';
import FollowButton from '@/components/account/follow-button/FollowButton';
import SelectDate from '@/components/account/select-date/SelectDate';
import Input from '@/components/common/Input';
import FeedNavigation from '@/components/common/feed-navigation/FeedNavigation';
import { queryClient } from '@/components/context/Providers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

import { formatShortDate } from '@/lib/dateFormatters';
import { formatNumberToCompact } from '@/lib/shortNumberFormatter';

import { type AccountDetails as AccountDetailsType } from '@/types/AccountDetails.type';

const DEFAULT_DESCRIPTION = "This user doesn't have a description";

const getAccountDetailsQueryKey = (userId: string) => [
  'accountDetails',
  userId,
];

export type DateValues = {
  day: number;
  month: number;
  year: number;
};

const NAME_CHAR_LIMIT = 40;
const DESCRIPTION_CHAR_LIMIT = 160;
const LOCATION_CHAR_LIMIT = 30;

const getInitialBirthdayState = (birthday?: Date | null) => {
  const birthdayDate = new Date();

  birthdayDate.setFullYear(
    birthday ? new Date(birthday).getFullYear() : new Date().getFullYear()
  );
  birthdayDate.setMonth(birthday ? new Date(birthday).getMonth() : 0);
  birthdayDate.setDate(birthday ? new Date(birthday).getDate() : 1);

  const day = birthdayDate.getDate();
  const month = birthdayDate.getMonth();
  const year = birthdayDate.getFullYear();

  return { day, month, year };
};

const setPointerEventsOnBody = (val: boolean) => {
  // workaround for closing select and dialog at the same time
  // https://github.com/radix-ui/primitives/issues/1241
  if (!val) {
    setTimeout(() => {
      document.body.style.pointerEvents = 'auto';
    }, 1);
  }
};

export default function AccountDetails({
  initialAccountDetails,
}: {
  initialAccountDetails: AccountDetailsType;
}) {
  const { data: session } = useSession();
  const params = useParams();
  const { toast } = useToast();

  const { data: accountDetails } = useQuery({
    queryFn: () => getAccoundDetails(initialAccountDetails.id),
    queryKey: getAccountDetailsQueryKey(initialAccountDetails.id),
    initialData: initialAccountDetails,
  });

  const { mutate: updateUserInfo, isLoading: updatingUser } = useMutation({
    mutationFn: async () =>
      await updateAccountDetails(initialAccountDetails.id, {
        name: newName,
        description: newDescription,
        born: new Date(dateValues.year, dateValues.month, dateValues.day),
        location: newLocation,
      }),
    mutationKey: ['updateAccountDetails'],
    onSuccess: () => {
      queryClient.invalidateQueries(
        getAccountDetailsQueryKey(initialAccountDetails.id)
      );
      setEditModalOpen(false);
    },
    onError: (err: any) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description:
          err?.message ??
          `We couldn't update your profile. Please try again later.`,
      });
    },
  });

  const [newName, setNewName] = useState(accountDetails.name ?? '');
  const [newDescription, setNewDescription] = useState(
    accountDetails?.description ?? ''
  );
  const [dateValues, setDateValues] = useState<DateValues>(
    getInitialBirthdayState(accountDetails.born)
  );
  const [newLocation, setNewLocation] = useState(accountDetails.location ?? '');

  const [editModalOpen, setEditModalOpen] = useState(false);

  const daysInMonth = useMemo<number>(
    () => getDaysInMonth(new Date(dateValues.year, dateValues.month)),
    [dateValues.year, dateValues.month]
  );

  const formIsInvalid = useMemo<boolean>(
    () =>
      newLocation.trim().length <= LOCATION_CHAR_LIMIT &&
      newDescription.trim().length <= DESCRIPTION_CHAR_LIMIT &&
      newName.trim().length <= NAME_CHAR_LIMIT &&
      isBefore(
        new Date(dateValues.year, dateValues.month, dateValues.day),
        new Date()
      ),
    [newLocation, newDescription, newName, dateValues]
  );

  const isFollowing = useMemo(
    () =>
      !!session?.user.id &&
      accountDetails?.followers?.includes(session?.user.id),
    [session?.user.id, accountDetails?.followers]
  );

  const isCurrentUsersPage = session?.user.id === accountDetails?.id;

  const showSubInfoTags = !!accountDetails?.born || !!accountDetails?.location;

  return (
    <Dialog
      open={editModalOpen}
      onOpenChange={(val) => {
        setDateValues(getInitialBirthdayState(accountDetails.born));
        setNewName(accountDetails.name ?? '');
        setNewDescription(accountDetails?.description ?? '');
        setNewLocation(accountDetails.location ?? '');
        setEditModalOpen(val);
        setPointerEventsOnBody(val);
      }}
    >
      <DialogContent className="h-full flex flex-col sm:h-min">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
        </DialogHeader>
        <Input
          value={newName}
          setValue={setNewName}
          limitCharacters={NAME_CHAR_LIMIT}
          name="name"
          placeholder="Name"
        />
        <Input
          value={newDescription}
          setValue={setNewDescription}
          limitCharacters={DESCRIPTION_CHAR_LIMIT}
          name="description"
          placeholder="Description"
          type="textarea"
        />
        <Input
          value={newLocation}
          setValue={setNewLocation}
          limitCharacters={LOCATION_CHAR_LIMIT}
          name="location"
          placeholder="Location"
        />
        <SelectDate
          date={dateValues}
          daysInMonth={daysInMonth}
          setDate={setDateValues}
        />

        <button
          onClick={() => updateUserInfo()}
          className={
            'bg-white text-background px-4 py-1.5 rounded-full font-bold transition-colors disabled:bg-white/50'
          }
          disabled={updatingUser || !formIsInvalid}
        >
          Submit
        </button>
      </DialogContent>
      <div className="flex flex-col border-b border-gray-600">
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
                <FollowButton
                  isFollowing={isFollowing}
                  queryKey={getAccountDetailsQueryKey(initialAccountDetails.id)}
                  userId={accountDetails.id}
                  username={accountDetails.name!}
                />
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
                  text={`Born ${formatShortDate(
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
                  accountDetails?.following?.length ?? 0
                )} `}
              </span>{' '}
              Following
            </p>
            <p className="text-sm text-gray-400">
              <span className="text-white font-semibold">
                {`${formatNumberToCompact(
                  accountDetails?.followers?.length ?? 0
                )} `}
              </span>
              Followers
            </p>
          </div>
        </div>
        <FeedNavigation
          links={[
            {
              href: `/account/${params?.userId}/tweets`,
              label: 'Tweets',
            },
            { href: `/account/${params?.userId}/likes`, label: 'Likes' },
          ]}
        />
      </div>
    </Dialog>
  );
}
