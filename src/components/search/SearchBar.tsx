'use client';

import { SearchIcon } from 'lucide-react';
import { FormEvent, forwardRef } from 'react';

export const SearchBar = forwardRef<
  HTMLInputElement,
  { onSearch: () => void; initialValue: string }
>(({ onSearch, initialValue }, ref) => {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex p-2 md:p-4 rounded-full bg-gray-800 gap-2 mx-2 md:mx-4 mt-3 md:mt-6 mb-2 md:mb-4"
    >
      <SearchIcon className="text-gray-600" />
      <input
        ref={ref}
        type="text"
        defaultValue={initialValue}
        className="w-full bg-transparent placeholder:text-gray-600 outline-none"
        placeholder="Search"
      />
    </form>
  );
});

SearchBar.displayName = 'SearchBar';
