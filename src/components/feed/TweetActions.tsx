import { EditIcon, MoreHorizontalIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

import { EditTweetForm } from '@/components/common/EditTweetForm';
import { Dialog } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function TweetActions({
  id,
  queryKey,
  tweetBody,
  authorId,
}: {
  id: string;
  tweetBody: string;
  authorId: string;
  queryKey?: string[];
}) {
  // TODO: Add delete option to tweets that will make them hidden instead of deleting them
  const { data: session } = useSession();

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex text-gray-600 h-5 w-5 items-center justify-center hover:text-gray-400 transition-colors">
            <MoreHorizontalIcon />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top">
          <DropdownMenuItem
            disabled={session?.user?.id !== authorId}
            onClick={(e) => e.stopPropagation()}
            onSelect={() => setDialogOpen(true)}
            className="flex items-center gap-2 p-3"
          >
            <EditIcon className="h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditTweetForm
        closeDialog={() => setDialogOpen(false)}
        id={id}
        initialMessage={tweetBody}
        queryKey={queryKey}
      />
    </Dialog>
  );
}
