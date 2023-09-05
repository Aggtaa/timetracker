import { Event } from '@prisma/client';

import { TimePeriod } from './period';

export type DayStatistics<B = TimePeriod[]> = {
  day: Date,
  busy: B;
  total: number;
  totalIncludingOverlapping: number;
  events: Event[];
}

export type Statistics = {
  events: Event[];
  days: DayStatistics[];
}
