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
      name="Test User Name"
      description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium nostrum, asperiores exercitationem ea vitae rem rerum? Consequuntur voluptatibus fuga ea!"
      image={'https://cdn.discordapp.com/embed/avatars/2.png'}
      email={'test@email.com'}
      userId={params.userId}
      followersCount={69_000}
      followingCount={420_000}
    />
  );
}
