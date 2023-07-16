import Linkify from 'linkify-react';
import { EventListeners } from 'linkifyjs';
import Link from 'next/link';
import React, { PropsWithChildren } from 'react';

type LinkProps = {
  tagName: any;
  attributes: { [attr: string]: any };
  content: string;
  eventListeners: EventListeners;
};

function RenderLink({ attributes, content }: LinkProps) {
  const { href, ...props } = attributes;

  return (
    <a
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="text-sky-500 underline"
      href={href}
      {...props}
    >
      {content}
    </a>
  );
}

export function TextWithLinks({ children }: PropsWithChildren) {
  return <Linkify options={{ render: RenderLink }}>{children}</Linkify>;
}
