import React from 'react';

import AccountHeader from '@/components/account/AccountHeader';
import MainWrapper from '@/components/layout/MainWrapper';

export default function AccountPage() {
  return (
    <MainWrapper
      headerComponent={
        <AccountHeader accountName="TODO change to actual account name" />
      }
    ></MainWrapper>
  );
}
