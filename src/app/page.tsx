import { getServerSession } from 'next-auth';
import { SignInButton, SignOutButton } from '@/components/UserHadnlingButtons';

export default async function Home() {
  const session = await getServerSession();
  return (
    <main className='flex min-h-screen flex-col w-full bg-black items-center p-24 text-white'>
      {!!session?.user && (
        <>
          {session.user.email} <SignOutButton />
        </>
      )}
      {!session?.user && <SignInButton />}
    </main>
  );
}
