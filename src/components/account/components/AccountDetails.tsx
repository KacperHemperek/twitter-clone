import Image from 'next/image';
import React from 'react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';

function HeaderImageLoader() {
  return <div className="w-full h-full " />;
}

export default function AccountDetails() {
  return (
    <div className="flex flex-col">
      <div className="aspect-[3/1] w-full relative">
        <Image
          src={
            'https://images.unsplash.com/photo-1509023464722-18d996393ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
          }
          fill={true}
          className="object-cover "
          alt={'background image of a user'}
          placeholder="blur"
          blurDataURL="https://images.unsplash.com/photo-1509023464722-18d996393ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        />
      </div>
      <div className="flex flex-col p-4">
        <div className="flex justify-between relative">
          <div />
          <div className="p-1 bg-background rounded-full absolute -translate-y-[60%] max-w-[128px] min-w-[84px] w-1/4 aspect-square">
            <Avatar className="w-full h-full">
              <AvatarImage
                src={'https://cdn.discordapp.com/embed/avatars/3.png'}
              />
            </Avatar>
          </div>
          <div className="flex flex-row gap-2">
            <button className="bg-white text-background px-4 py-1.5 rounded-full font-bold">
              Follow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
