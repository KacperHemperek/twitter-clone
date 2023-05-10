import Feed from '@/components/feed/Feed';

export default async function Home() {
  return (
    <div className='flex min-h-screen w-full flex-col items-center text-white'>
      <div className='refative flex h-full min-h-screen w-full flex-col border-x border-x-gray-700'>
        <div className='sticky left-0 right-0 top-0 flex w-full items-center justify-between border-b border-b-gray-700 bg-background/10 p-6 backdrop-blur-lg'>
          <h1 className='text-2xl font-bold'>Home</h1>
        </div>

        <Feed initialPosts={['post1', 'post2']} />
      </div>
    </div>
  );
}
