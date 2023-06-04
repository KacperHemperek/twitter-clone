import React, { PropsWithChildren } from 'react';

import AccountHeader from '@/components/account/components/AccountHeader';
import MainWrapper from '@/components/layout/MainWrapper';

export default function AccountDetailsLayout({ children }: PropsWithChildren) {
  return (
    <MainWrapper
      headerComponent={
        <AccountHeader accountName="TODO change to actual account name" />
      }
      showBorder={false}
    >
      {children}
    </MainWrapper>
  );
}
