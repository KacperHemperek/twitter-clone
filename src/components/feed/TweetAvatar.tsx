import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function TweetAvatar({
  image,
  authorName,
}: {
  image: string | null;
  authorName: string | null;
}) {
  return (
    <Avatar className="z-0 h-10 w-10">
      <AvatarImage src={image ?? undefined} />
      <AvatarFallback className="text-white">
        {authorName?.[0] ?? 'A'}
      </AvatarFallback>
    </Avatar>
  );
}
