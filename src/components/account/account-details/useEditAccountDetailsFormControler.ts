import { updateAccountDetails } from '@/clients/account.client';
import { useMutation } from '@tanstack/react-query';
import { getDaysInMonth, isBefore } from 'date-fns';
import React, { useMemo, useState } from 'react';

import { DateValues } from '@/components/account/account-details/AccountDetails';
import {
  getAccountDetailsQueryKey,
  getInitialBirthdayState,
} from '@/components/account/account-details/AccountDetailsUtils';
import {
  DESCRIPTION_CHAR_LIMIT,
  LOCATION_CHAR_LIMIT,
  NAME_CHAR_LIMIT,
} from '@/components/account/account-details/EditUserAccountConfig';
import { queryClient } from '@/components/context/Providers';
import { useToast } from '@/components/ui/use-toast';

export default function useEditAccountDetailsFormController({
  accountDetails,
}: {
  accountDetails: any;
}) {
  const { toast } = useToast();

  const updateUserAccountInfoMutation = useMutation({
    mutationFn: async () =>
      await updateAccountDetails(accountDetails.id, {
        name: newName,
        description: newDescription,
        born: new Date(dateValues.year, dateValues.month, dateValues.day),
        location: newLocation,
        background: bgImage,
        image: profileImage,
      }),
    mutationKey: ['updateAccountDetails'],
    onSuccess: () => {
      queryClient.invalidateQueries(
        getAccountDetailsQueryKey(accountDetails.id)
      );
      toast({
        variant: 'default',
        title: 'Success!',
        description: `Your profile has been updated. If some changes are not reflected immediately, please wait a few minutes and refresh the page.`,
        duration: 3000,
      });
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

  const [bgImage, setBgImage] = useState<{
    data: string;
    contentType: string;
  } | null>(null);

  const [profileImage, setProfileImage] = useState<{
    data: string;
    contentType: string;
  } | null>(null);

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

  return {
    ...updateUserAccountInfoMutation,
    newName,
    setNewName,
    newDescription,
    setNewDescription,
    dateValues,
    setDateValues,
    newLocation,
    setNewLocation,
    editModalOpen,
    setEditModalOpen,
    bgImage,
    setBgImage,
    profileImage,
    setProfileImage,
    daysInMonth,
    formIsInvalid,
  };
}
