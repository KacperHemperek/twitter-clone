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

export function formatShortDate(date: Date) {
  return Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function getMonthName(monthNumber: number) {
  const date = new Date(new Date().getFullYear(), monthNumber + 1, 0);
  return date.toLocaleString('en-US', { month: 'long' });
}
