import { Search } from 'lucide-react';

export function SearchBanner({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col text-center py-10 items-center">
      <Search className="w-10 h-10 text-gray-500" />
      <h4 className="text-lg font-semibold text-gray-400">{title}</h4>
      <p className="text-gray-500 text-sm max-w-[200px]">{description}</p>
    </div>
  );
}
