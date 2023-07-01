import React, { PropsWithChildren } from 'react';

import { getAccoundDetails } from '@/components/account/services/Account.service';

import AccountHeader from '@/components/account/components/AccountHeader';
import AccountDetails from '@/components/account/components/account-details/AccountDetails';
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
