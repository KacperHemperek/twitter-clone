import { getServerSession } from 'next-auth';
import { SignInButton, SignOutButton } from '@/components/UserHadnlingButtons';
import Feed from '@/components/feed/Feed';

export default async function Home() {
  const session = await getServerSession();
  return (
    <main className='flex min-h-screen w-full flex-col items-center bg-black text-white '>
      {!!session?.user && (
        <div className='refative flex h-full min-h-screen w-full max-w-2xl flex-col border-x border-x-gray-700'>
          <div className='sticky left-0 right-0 top-0 flex w-full items-center justify-between border-b border-b-gray-700 p-6 backdrop-blur-lg'>
            <p>{session.user?.email ?? 'No Email'}</p>
            <SignOutButton />
          </div>
          <Feed posts={['post1', 'post2']} />
        </div>
      )}
      {!session?.user && <SignInButton />}
    </main>
  );
}
