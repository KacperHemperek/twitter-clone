import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogTrigger,
  Overlay,
} from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import React from 'react';

export default function ImagePreview({
  children,
  image,
}: {
  children: React.ReactNode;
  image?: string | null;
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  function handleOpenChange(open: boolean) {
    if (open && image) {
      setDialogOpen(true);
    }
    if (!open) {
      setDialogOpen(false);
    }
  }

  return (
    <Dialog open={dialogOpen && !!image} onOpenChange={handleOpenChange}>
      <Overlay className="bg-white/10 fixed inset-0 z-10 backdrop-blur-sm">
        <button
          className="p-2 fixed top-14 right-4 md:right-10 md:top-10 z-50"
          onClick={() => setDialogOpen(false)}
        >
          <X className="w-6 h-6 text-foreground" />
        </button>
      </Overlay>

      <DialogPortal>
        <DialogContent className="fixed max-w-fit top-1/2 -translate-x-1/2 left-1/2 z-50 flex -translate-y-1/2 max-w-screen w-full max-h-[80vh] outline-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {image && (
            <img className="object-contain" src={image} alt="Image preview" />
          )}
        </DialogContent>
      </DialogPortal>
      <DialogTrigger asChild>{children}</DialogTrigger>
    </Dialog>
  );
}
