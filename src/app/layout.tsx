import { getServerSession } from 'next-auth';
import '@/globals.css';

import Providers from '@/components/Providers';

import NavBarContainer from '@/components/navbar/NavBarContainer';
import { SignInButton } from '@/components/UserHadnlingButtons';

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang='en'>
      <body className='dark bg-background text-white'>
        <Providers session={session}>
          <main className='relative mx-auto flex min-h-screen max-w-7xl'>
            {!!session?.user && (
              <>
                <NavBarContainer />
                {children}
              </>
            )}
            {!session?.user && (
              <div className='flex min-h-full w-full flex-col items-center justify-center gap-6 '>
                <h1 className='max-w-[350px] text-center text-2xl font-bold'>
                  <span>You are not logged in. </span>
                  <span>To use this app you need to log in</span>
                </h1>
                <SignInButton />
              </div>
            )}
          </main>
        </Providers>
      </body>
    </html>
  );
}
