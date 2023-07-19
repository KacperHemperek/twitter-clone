import React, { PropsWithChildren } from 'react';

import { getAccountDetails } from '@/services/Account.service';

import SectionHeader from '@/components/account/AccountHeader';
import AccountDetails from '@/components/account/account-details/AccountDetails';
import MainWrapper from '@/components/layout/MainWrapper';

type AccountLayoutProps = PropsWithChildren & {
  params: { userId: string };
};

export default async function AccountDetailsLayout({
  children,
  params,
}: AccountLayoutProps) {
  const user = await getAccountDetails(params.userId);
  return (
    <MainWrapper
      headerComponent={<SectionHeader title="Account" />}
      showBorder={false}
    >
      <AccountDetails initialAccountDetails={user} />
      {children}
    </MainWrapper>
  );
}
