import React from 'react';

// TODO: types of props
export default function Post({ post }: { post: any }) {
  return <div className='border-b border-gray-700 p-6 '>{post}</div>;
}
