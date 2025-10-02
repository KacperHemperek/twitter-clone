import { TextWithLinks } from '@/components/common/TextWithLinks';

import { cn } from '@/lib/cn';

const DEFAULT_DESCRIPTION = 'This user has not added a bio yet.';

export function AccountBio({ bio }: { bio: string | null | undefined }) {
  return (
    <TextWithLinks>
      <p
        className={cn(
          !bio?.length && 'text-gray-600',
          'text-sm overflow-break whitespace-pre-line'
        )}
      >
        {bio || !!bio?.length ? bio : DEFAULT_DESCRIPTION}
      </p>
    </TextWithLinks>
  );
}
