'use client';

import React from 'react';

export default function RootErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center  w-full h-full">
      <h1 className="text-3xl">We are so sorry, something went wrong 🫤</h1>
      <p className="text-xl">Please try again later</p>
    </div>
  );
}
