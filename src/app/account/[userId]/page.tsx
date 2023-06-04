import Image from 'next/image';
import React from 'react';

import AccountHeader from '@/components/account/AccountHeader';
import MainWrapper from '@/components/layout/MainWrapper';

export default function AccountPage() {
  return (
    <MainWrapper
      headerComponent={
        <AccountHeader accountName="TODO change to actual account name" />
      }
      showBorder={false}
    >
      <div className="h-52 w-full relative">
        <Image
          src={
            'https://images.unsplash.com/photo-1509023464722-18d996393ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
          }
          fill={true}
          className="object-cover "
          alt={'background image of a user'}
        />
      </div>
    </MainWrapper>
  );
}
