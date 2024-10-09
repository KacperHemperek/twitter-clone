import { LucideIcon } from 'lucide-react';
import React from 'react';

export default function AccountSubInfo({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex gap-2 items-center text-sm text-gray-400">
      <div className="w-4 h-4 flex">{icon}</div>
      <p>{text}</p>
    </div>
  );
}
