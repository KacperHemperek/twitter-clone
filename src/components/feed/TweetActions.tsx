import { deleteTweet } from '@/clients/tweets.client';
import { useMutation } from '@tanstack/react-query';
import { EditIcon, MoreHorizontalIcon, TrashIcon } from 'lucide-react';
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

import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { toast } from '../ui/use-toast';

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
  const { data: session } = useSession();

  const { mutate: deleteMutation } = useMutation({
    mutationFn: async (tweetId: string) => {
      await deleteTweet(tweetId);
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Deleted',
        description:
          'This tweet has beed deleted, now noone will be able to see it',
      });
    },
    onError: (e: any) => {
      toast({
        variant: 'destructive',
        title: 'Oh No',
        description:
          e.message ?? 'Could not delete tweet because of an unexpected error',
      });
    },
  });

  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  function toggleDropdown(val: boolean) {
    console.log('toggling dropdown');
    if (editDialogOpen || deleteDialogOpen) {
      setDropdownMenuOpen(true);
      return;
    }
    setDropdownMenuOpen(val);
  }

  return (
    // Stops all on click events from bubbling up to parent components otherwise this would
    // trigger going to tweet details whenever anything is clicked inside
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu open={dropdownMenuOpen} onOpenChange={toggleDropdown}>
        <DropdownMenuTrigger asChild>
          <button className="flex text-gray-600 h-5 w-5 items-center justify-center hover:text-gray-400 transition-colors">
            <MoreHorizontalIcon />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top">
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DropdownMenuItem
              disabled={session?.user?.id !== authorId}
              onSelect={() => setEditDialogOpen(true)}
              className="flex items-center gap-2 p-3"
            >
              <EditIcon className="h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <EditTweetForm
              closeDialog={() => setEditDialogOpen(false)}
              id={id}
              initialMessage={tweetBody}
              queryKey={queryKey}
            />
          </Dialog>
          <ConfirmationDialog
            title="Delete tweet?"
            message="After you delete this tweet it won't be available to either you nor your followers. Are you sure you want to do that?"
            confirmLabel="Delete Tweet"
            cancelLabel="Cancel"
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={() => {
              deleteMutation(id);
            }}
            onCancel={() => {
              console.log('Cancel deletion');
              setDeleteDialogOpen(false);
              setDropdownMenuOpen(false);
            }}
            trigger={
              <DropdownMenuItem
                disabled={session?.user?.id !== authorId}
                onSelect={() => setDeleteDialogOpen(true)}
                className="flex items-center gap-2 p-3"
              >
                <TrashIcon className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
