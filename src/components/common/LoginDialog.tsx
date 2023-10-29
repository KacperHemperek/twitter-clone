import { signIn } from 'next-auth/react';
import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function LoginDialog({ trigger }: { trigger: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="border-none sm:max-w-[350px] h-full justify-start sm:justify-start flex flex-col sm:h-fit">
        <DialogHeader>
          <DialogTitle className="text-xl">Please Login</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-base text-gray-600 mb-4">
          You cannot use that function, If you wish to try that please login
          with a discord account.
        </DialogDescription>
        <DialogFooter className="flex w-full gap-4 flex-col sm:flex-col space-x-0 sm:space-x-0">
          <button
            onClick={() => signIn()}
            // disabled={followingUserLoading}
            className="py-3 border-2 font-semibold m-0 rounded-full border-white bg-white text-background disabled:bg-gray-400 disabled:border-gray-400 disabled:text-gray-600"
          >
            Login
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
