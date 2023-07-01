'use client';

import React from 'react';

import MainWrapper from '@/components/layout/MainWrapper';

export default function RootErrorPage() {
  return (
    <MainWrapper>
      <div className="flex flex-col items-center justify-center text-center  w-full h-full">
        <h1 className="text-3xl mb-2">
          We are so sorry, something went wrong 🫤
        </h1>
        <p className="text-xl text-gray-700">Please try again later</p>
      </div>
    </MainWrapper>
  );
}
