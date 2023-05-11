import Feed from '@/components/feed/Feed';
import { Post } from '@/types/Post.type';

export default async function Home() {
  const posts: { data: Post[] } = await fetch(
    process.env.NEXTAUTH_URL! + '/api/posts'
  ).then((res) => res.json());

  return (
    <div className='flex min-h-screen w-full flex-col items-center text-white'>
      <div className='refative flex h-full min-h-screen w-full flex-col border-x border-x-gray-700'>
        <div className='sticky left-0 right-0 top-0 flex w-full items-center justify-between border-b border-b-gray-700 bg-background/10 p-6 backdrop-blur-lg'>
          <h1 className='text-2xl font-bold'>Home</h1>
        </div>

        <Feed initialPosts={posts.data} />
      </div>
    </div>
  );
}
