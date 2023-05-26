import TimeAgo from 'javascript-time-ago';
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

export function formatLongDate(date: Date) {
  const dateFormatter = Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  const hourFormatter = Intl.DateTimeFormat('en-US', {
    timeStyle: 'short',
  });

  return hourFormatter.format(date) + ' · ' + dateFormatter.format(date);
}
