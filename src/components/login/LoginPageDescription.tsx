import { Check } from 'lucide-react';
import React from 'react';

function LoginPageListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <div>
        <Check className="w-3 h-3 mt-1.5 text-sky-500" />
      </div>
      {children}
    </li>
  );
}

export default function LoginPageDescription() {
  return (
    <>
      <h1 className="text-xl text-foreground font-semibold pb-6">Hi There</h1>
      <p className="pb-2">If you want to use all features off this app like:</p>
      <ul className="pb-8 flex flex-col gap-1">
        <LoginPageListItem>
          Creating your own posts and comments
        </LoginPageListItem>
        <LoginPageListItem>Liking posts and comments</LoginPageListItem>
        <LoginPageListItem>
          Following users, getting followers and viewing your followed feed
        </LoginPageListItem>
        <LoginPageListItem>Searching for users and posts</LoginPageListItem>
      </ul>
    </>
  );
}
