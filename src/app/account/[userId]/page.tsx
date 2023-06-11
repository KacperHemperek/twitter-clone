import React from 'react';

import { getAccoundDetails } from '@/components/account/services/Account.service';

import AccountDetails from '@/components/account/components/account-details/AccountDetails';

export default async function AccountPage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await getAccoundDetails(params.userId);

  return <AccountDetails initialAccountDetails={user} />;
}
