'use client';

import { AccountBio } from './AccountDescription';
import { useQuery } from '@tanstack/react-query';
import { PartyPopper, Pin, UserCog } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';
import { useWindowSize } from 'usehooks-ts';

import { getAccountDetails } from '@/services/Account.service';

import {
  getAccountDetailsQueryKey,
  getInitialBirthdayState,
  setPointerEventsOnBody,
} from '@/components/account/account-details/AccountDetailsUtils';
import BackgroundImageInput from '@/components/account/account-details/BackgroundImageInput';
import ProfileImageInput from '@/components/account/account-details/ProfileImageInput';
import useEditAccountDetailsFormController from '@/components/account/account-details/useEditAccountDetailsFormControler';
import AccountSubInfo from '@/components/account/account-sub-info/AccountSubInfo';
import { FollowButton } from '@/components/account/follow-button/FollowButton';
import SelectDate from '@/components/account/select-date/SelectDate';
import { FollowsYouIndicator } from '@/components/common/FollowsYouIndicator';
import ImagePreview from '@/components/common/ImagePreview';
import Input from '@/components/common/Input';
import FeedNavigation from '@/components/common/feed-navigation/FeedNavigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { cn } from '@/lib/cn';
import { formatShortDate } from '@/lib/dateFormatters';
import { formatNumberToCompact } from '@/lib/shortNumberFormatter';

import { type AccountDetails as AccountDetailsType } from '@/types/AccountDetails.type';

export type DateValues = {
  day: number;
  month: number;
  year: number;
};

const NAME_CHAR_LIMIT = 40;
const DESCRIPTION_CHAR_LIMIT = 220;
const LOCATION_CHAR_LIMIT = 30;

export default function AccountDetails({
  initialAccountDetails,
}: {
  initialAccountDetails: AccountDetailsType;
}) {
  const { width } = useWindowSize();
  const { data: session } = useSession();
  const params = useParams();

  const { data: accountDetails } = useQuery({
    queryFn: () => getAccountDetails(initialAccountDetails.id),
    queryKey: getAccountDetailsQueryKey(initialAccountDetails.id),
    initialData: initialAccountDetails,
  });

  const {
    bgImage,
    setBgImage,
    newName,
    setNewName,
    newDescription,
    setNewDescription,
    newLocation,
    setNewLocation,
    dateValues,
    setDateValues,
    formIsInvalid,
    daysInMonth,
    editModalOpen,
    setEditModalOpen,
    profileImage,
    setProfileImage,
    mutate: updateUserInfo,
    isLoading: updatingUser,
  } = useEditAccountDetailsFormController({ accountDetails });

  const isFollowing = useMemo(
    () =>
      !!session?.user.id &&
      accountDetails?.followers?.includes(session?.user.id),
    [session?.user.id, accountDetails?.followers]
  );

  const isCurrentUsersPage = session?.user.id === accountDetails?.id;

  const showSubInfoTags = !!accountDetails?.born || !!accountDetails?.location;

  const compact = width < 640;

  return (
    <Dialog
      open={editModalOpen}
      onOpenChange={(val) => {
        setDateValues(getInitialBirthdayState(accountDetails.born));
        setNewName(accountDetails.name ?? '');
        setNewDescription(accountDetails?.description ?? '');
        setNewLocation(accountDetails.location ?? '');
        setBgImage(null);
        setProfileImage(null);
        setEditModalOpen(val);
        setPointerEventsOnBody(val);
      }}
    >
      <DialogContent className="h-full flex flex-col sm:h-min">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
        </DialogHeader>
        <BackgroundImageInput
          image={bgImage}
          setImage={setBgImage}
          defaultImage={accountDetails.background}
        />
        <ProfileImageInput
          setImage={setProfileImage}
          image={profileImage}
          defaultImage={accountDetails.image}
        />
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
        <ImagePreview image={accountDetails.background}>
          <div className="aspect-[3/1] w-full relative cursor-pointer">
            <Image
              src={
                accountDetails?.background ??
                'https://images.unsplash.com/photo-1509023464722-18d996393ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
              }
              fill={true}
              className="object-cover"
              alt={'background image of a user'}
              placeholder="blur"
              blurDataURL="https://images.unsplash.com/photo-1509023464722-18d996393ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
            />
            I
          </div>
        </ImagePreview>

        <div className="flex flex-col gap-4 sm:gap-4 p-4">
          <div className="flex justify-between relative sm:mb-4">
            <div />
            <ImagePreview image={accountDetails.image ?? ''}>
              <div className="p-1 bg-background rounded-full absolute -translate-y-[60%] max-w-[128px] min-w-[84px] w-1/4 aspect-square cursor-pointer">
                <Avatar className="w-full h-full">
                  <AvatarImage src={accountDetails?.image ?? ''} />
                  <AvatarFallback className="text-xl">
                    {accountDetails?.name?.[0] || ''}
                  </AvatarFallback>
                </Avatar>
              </div>
            </ImagePreview>
            <div className="flex flex-row gap-2">
              {isCurrentUsersPage && (
                <DialogTrigger
                  className={cn(
                    'bg-background text-white hover:bg-white/10 transition-all px-4 py-1.5 rounded-full font-bold border border-white',
                    compact && 'p-1.5'
                  )}
                >
                  {compact ? <UserCog className="w-4 h-4" /> : 'Edit Profile'}
                </DialogTrigger>
              )}
              {!isCurrentUsersPage && (
                <FollowButton
                  isFollowing={isFollowing}
                  queryKey={getAccountDetailsQueryKey(initialAccountDetails.id)}
                  userId={accountDetails.id}
                  username={accountDetails.name!}
                  compact={compact}
                />
              )}
            </div>
          </div>

          <div className={'flex flex-col text-lg leading-[22px]'}>
            <h5 className="truncate font-bold text-xl">
              {accountDetails?.name}
            </h5>

            <div className="space-x-2 flex">
              <span className="truncate text-gray-400 text-sm">{`@${accountDetails?.email}`}</span>
              {accountDetails.following.some((f) => f === session?.user.id) && (
                <FollowsYouIndicator />
              )}
            </div>
          </div>
          <AccountBio bio={accountDetails.description} />
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
