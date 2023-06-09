import React, { PropsWithChildren } from 'react';

import { getAccoundDetails } from '@/services/Account.service';

import AccountHeader from '@/components/account/AccountHeader';
import AccountDetails from '@/components/account/account-details/AccountDetails';
import MainWrapper from '@/components/layout/MainWrapper';

type AccountLayoutProps = PropsWithChildren & {
  params: { userId: string };
};

export default async function AccountDetailsLayout({
  children,
  params,
}: AccountLayoutProps) {
  const user = await getAccoundDetails(params.userId);
  return (
    <MainWrapper
      headerComponent={<AccountHeader accountName="Account" />}
      showBorder={false}
    >
      <AccountDetails initialAccountDetails={user} />
      {children}
    </MainWrapper>
  );
}
