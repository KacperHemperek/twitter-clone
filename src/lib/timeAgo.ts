import TimeAgo from 'javascript-time-ago';

// English.
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo('en-US');

export function formatTweetDate(date: Date) {
  const timeDiff = (new Date().getTime() - date.getTime()) / 1000;
  if (timeDiff < 60) {
    return '1m';
  }

  return timeAgo.format(date, 'mini');
}
