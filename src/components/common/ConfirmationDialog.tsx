import { ReactNode } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ConfirmationDialogProps = {
  open: boolean;
  message: string;
  title: string;
  trigger: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  cancelDisabled?: boolean;
  confirmDisabled?: boolean;
  onConfirm: React.MouseEventHandler<HTMLButtonElement>;
  onCancel: React.MouseEventHandler<HTMLButtonElement>;
  onOpenChange: (val: boolean) => void;
};

export function ConfirmationDialog({
  onCancel,
  onConfirm,
  onOpenChange,
  open,
  message,
  title,
  trigger,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  cancelDisabled = false,
  confirmDisabled = false,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger}
      {open && (
        <DialogContent className="border-none sm:max-w-[350px] h-full justify-start sm:justify-start flex flex-col sm:h-fit">
          <DialogHeader>
            <DialogTitle className="text-xl">{title}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-base text-gray-600 mb-4">
            {message}
          </DialogDescription>
          <DialogFooter className="flex w-full gap-4 flex-col sm:flex-col space-x-0 sm:space-x-0">
            <button
              onClick={onConfirm}
              disabled={confirmDisabled}
              className={
                'py-3 border-2 font-semibold m-0 rounded-full border-white bg-white text-background disabled:bg-gray-400 disabled:border-gray-400 disabled:text-gray-600'
              }
            >
              {confirmLabel}
            </button>
            <button
              disabled={cancelDisabled}
              onClick={onCancel}
              className="py-3 border-2 font-semibold m-0 rounded-full border-white disabled:border-gray-600 disabled:text-gray-600"
            >
              {cancelLabel}
            </button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
