import Image from 'next/image';
import React from 'react';

import AccountHeader from '@/components/account/components/AccountHeader';
import AccountDetails from '@/components/account/components/account-details/AccountDetails';
import MainWrapper from '@/components/layout/MainWrapper';

const wait = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

export default async function AccountPage() {
  await wait(20_000);

  return <AccountDetails />;
}
