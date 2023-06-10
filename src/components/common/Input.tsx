'use client';

import React, { useState } from 'react';

import { cn } from '@/lib/cn';

export default function Input({
  value,
  setValue,
  name,
  placeholder,
  limitCharacters,
}: {
  name: string;
  placeholder: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  limitCharacters?: number;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const valueLength = value.trim().length;

  const showCharacterLimitValue = valueLength || isFocused;

  return (
    <label
      className="group  border-2 rounded-md border-gray-700 focus-within:border-sky-500 transition-colors duration-200"
      htmlFor={name}
    >
      <div className="my-2 mx-3 flex flex-col">
        <div className="text-sm flex transition-colors justify-end w-full relative h-5">
          <span
            className={cn(
              'group-focus-within:top-0 group-focus-within:text-sm group-focus-within:translate-y-0 left-0 text-lg text-gray-700 absolute group-focus-within:text-sky-500 duration-200 translate-y-1/4',
              value.trim().length > 0 && 'top-0 left-0 text-sm translate-y-0'
            )}
          >
            {placeholder}
          </span>
          {limitCharacters && (
            <span className="text-gray-700">
              {showCharacterLimitValue && `${valueLength} / ${limitCharacters}`}
            </span>
          )}
        </div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          id={name}
          className="bg-transparent outline-none"
        />
      </div>
    </label>
  );
}
