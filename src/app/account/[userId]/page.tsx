import Image from 'next/image';
import React from 'react';

import AccountDetails from '@/components/account/components/AccountDetails';
import AccountHeader from '@/components/account/components/AccountHeader';
import MainWrapper from '@/components/layout/MainWrapper';

export default function AccountPage() {
  return (
    <MainWrapper
      headerComponent={
        <AccountHeader accountName="TODO change to actual account name" />
      }
      showBorder={false}
    >
      <AccountDetails />
    </MainWrapper>
  );
}
