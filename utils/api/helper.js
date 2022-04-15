import { format, formatDistance } from 'date-fns';

export function getDateDisplay(publishDate) {
  const publishDateAsDate = new Date(publishDate);
  const displayDate = format(publishDateAsDate, 'MMMM do, yyyy');
  const timeAgo = formatDistance(publishDateAsDate, new Date(), {
    addSuffix: true
  });
  return `${displayDate} (${timeAgo})`;
}
