import { Event } from '@prisma/client';

import { formatDate, formatTimePeriod } from './time';

export type EventFormatOptions = {
  id: boolean;
  date: boolean;
}

const defaultOptions: EventFormatOptions = {
  id: true,
  date: true,
};

export function formatEvent(
  event: Event,
  options: Partial<EventFormatOptions> = {},
): string {

  const opts = { ...defaultOptions, ...options };

  const tokens: string[] = [];

  if (opts.id)
    tokens.push(`${event.id}`);

  if (opts.date)
    tokens.push(formatDate(event.day));

  tokens.push(`[${formatTimePeriod(event)}]`);

  tokens.push(event.description);

  return tokens.join(' ');
}
