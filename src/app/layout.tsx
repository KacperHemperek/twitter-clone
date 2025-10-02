import '@/globals.css';
import { authOptions } from '@/utils/next-auth';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';

import { SignInButton } from '@/components/common/UserHandlingButtons';
import Providers from '@/components/context/Providers';
import NavBarContainer from '@/components/navbar/NavBarContainer';

export const metadata: Metadata = {
  title: 'Twitter Clone',
  description: 'Simple twitter clone made with nextjs 13 app directory',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className="dark overflow-auto overscroll-none bg-background text-white"
      >
        <Providers session={session}>
          <main className="relative mx-auto flex min-h-[100dvh] xl:max-w-5xl">
            <NavBarContainer />
            <div className="w-[calc(100vw-44px)] flex md:w-[calc(100vw-288px)] xl:w-full">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
