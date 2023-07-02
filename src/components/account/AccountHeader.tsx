'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AccountHeader({
  accountName,
}: {
  accountName: string;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4 p-4 w-full">
      <div>
        <ArrowLeft
          className=" mt-0.5  cursor-pointer"
          onClick={() => router.back()}
        />
      </div>
      <h1 className="mt-0.5 text-xl font-bold md:text-[22px] truncate ">
        {accountName}
      </h1>
    </div>
  );
}
