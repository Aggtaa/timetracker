import { DayStatistics } from '@timetracker/types-lib';

import { EventFormatOptions, formatEvent } from './event';
import { formatDate, formatDuration } from './time';

export type DayFormatOptions = {
  event?: Partial<EventFormatOptions>,
}

const defaultOptions: DayFormatOptions = {

};

export function formatDay(
  day: DayStatistics,
  options: Partial<DayFormatOptions> = {},
): string {

  const opts = { ...defaultOptions, ...options };

  const lines: string[] = [];

  lines.push(formatDate(day.day));
  lines.push(`Total time tracked: ${formatDuration(day.total)}`);
  if (day.totalIncludingOverlapping !== day.total)
    lines.push(`Total time tracked (including overlapping tasks): ${formatDuration(day.totalIncludingOverlapping)}`);

  lines.push(
    ...day.events
      .map((ev) => formatEvent(ev, { date: false, ...opts.event })),
  );

  return lines.join('\n');
}
