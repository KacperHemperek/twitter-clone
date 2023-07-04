import { NextRequest, NextResponse } from 'next/server';

export async function retweetHandler(req: NextRequest, tweetId: string) {
  console.log('retweetHandler');
  return NextResponse.json({ message: 'retweeted tweet with id: ' + tweetId });
}
