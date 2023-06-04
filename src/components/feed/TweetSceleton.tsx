import { Avatar, AvatarFallback } from '../ui/avatar';

export function TweetSceleton() {
  return (
    <div className="flex space-x-3 border-b border-gray-700 p-3 text-sm">
      <Avatar className="z-0 h-10 w-10">
        <AvatarFallback className="animate-pulse text-white"></AvatarFallback>
      </Avatar>
      <div className="flex-grow space-y-1">
        <div className="flex items-center space-x-1">
          <div className="my-1 h-4 w-24 animate-pulse rounded-full bg-muted"></div>
          <div className="my-1 h-4 w-24 animate-pulse rounded-full bg-muted"></div>
        </div>
        <div className="my-1 h-4 w-full animate-pulse rounded-full bg-muted"></div>
        <div className="my-1 h-4 w-5/6 animate-pulse rounded-full bg-muted"></div>
        <div className="my-1 h-4 w-2/5 animate-pulse rounded-full bg-muted"></div>

        <div className="mt-2 grid grid-cols-3">
          <div className="my-1 h-4 w-10 animate-pulse rounded-full bg-muted"></div>

          <div className="my-1 h-4 w-10 animate-pulse rounded-full bg-muted"></div>

          <div className="my-1 h-4 w-10 animate-pulse rounded-full bg-muted"></div>
        </div>
      </div>
    </div>
  );
}
