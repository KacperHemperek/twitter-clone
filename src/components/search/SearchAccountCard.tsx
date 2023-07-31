import { SEARCH_USERS_QUERY_KEY } from '@/app/search/accounts/page';
import React from 'react';

import FollowButton from '@/components/account/follow-button/FollowButton';
import { TextWithLinks } from '@/components/common/TextWithLinks';
import TweetUserInfo from '@/components/common/tweet-user-info/TweetUserInfo';
import TweetAvatar from '@/components/feed/TweetAvatar';

export default function SearchAccountCard({
  name,
  id,
  description,
  email,
  image,
  isFollowing,
}: {
  name: string;
  id: string;
  email: string;
  description: string | null;
  image: string;
  isFollowing: boolean;
}) {
  return (
    <div className="flex p-4 border-b border-gray-700 space-x-6 items-start">
      <div className="flex space-x-3 flex-grow">
        <TweetAvatar image={image} authorName={name} authorId={id} />
        <div className="flex flex-col gap-1">
          <TweetUserInfo authorEmail={email} authorName={name} />
          <TextWithLinks>
            <p className="text-base overflow-break">
              {description ?? "This user doesn't have a description"}
            </p>
          </TextWithLinks>
        </div>
      </div>

      <FollowButton
        isFollowing={isFollowing}
        queryKey={SEARCH_USERS_QUERY_KEY}
        userId={id}
        username={name}
      />
    </div>
  );
}
