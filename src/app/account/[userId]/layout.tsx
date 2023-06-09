import React, { PropsWithChildren } from 'react';

import { getAccoundDetails } from '@/components/account/services/Account.service';

import AccountHeader from '@/components/account/components/AccountHeader';
import MainWrapper from '@/components/layout/MainWrapper';

export default async function AccountDetailsLayout({
  children,
}: PropsWithChildren) {
  return (
    <MainWrapper
      headerComponent={<AccountHeader accountName="Account" />}
      showBorder={false}
    >
      {children}
    </MainWrapper>
  );
}
