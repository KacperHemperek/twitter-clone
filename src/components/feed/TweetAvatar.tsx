import Link from 'next/link';
import React from 'react';

import LoginDialog from '@/components/common/LoginDialog';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function TweetAvatar({
  image,
  authorName,
  authorId,
}: {
  image: string | null;
  authorName: string | null;
  authorId: string | null;
}) {
  if (!authorId)
    return (
      <LoginDialog
        trigger={
          <Avatar className="z-0 h-10 w-10 cursor-pointer">
            <AvatarFallback />
          </Avatar>
        }
      />
    );

  return (
    <Link
      href={`/account/${authorId}/tweets`}
      className="w-min h-min"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Avatar className="z-0 h-10 w-10">
        <AvatarImage src={image ?? undefined} />
        <AvatarFallback className="text-white">
          {authorName?.[0] ?? ''}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
}
