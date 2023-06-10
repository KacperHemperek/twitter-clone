import React from 'react';

import { getAccoundDetails } from '@/components/account/services/Account.service';

import AccountDetails from '@/components/account/components/account-details/AccountDetails';

export default async function AccountPage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await getAccoundDetails(params.userId);

  return (
    <AccountDetails
      name={user.name ?? ''}
      description={user.description}
      image={user.image ?? ''}
      email={user.email ?? ''}
      userId={params.userId}
      followersCount={user.followingCount}
      followingCount={user.followingCount}
      born={user.born ? new Date(user.born) : undefined}
      location={user.location ?? undefined}
    />
  );
}
