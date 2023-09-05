import { Event } from '@prisma/client';
import { DayStatistics } from '@timetracker/types-lib';

import { Busy } from './busy';

export class Days {
  public readonly days: DayStatistics<Busy>[] = [];

  private getDay(date: Date) {
    const day = this.days.find((d) => d.day.getTime() === date.getTime());
    if (day)
      return day;

    const newDay = {
      day: date,
      busy: new Busy(),
      total: 0,
      totalIncludingOverlapping: 0,
      events: [],
    };

    this.days.push(newDay);
    return newDay;
  }

  public add(...events: Event[]): void {

    for (const event of events) {
      const length = event.finish - event.start;

      const day = this.getDay(event.day);

      day.busy.add(event);
      day.totalIncludingOverlapping += length;
      day.events.push(event);
    }

    for (const day of Object.values(this.days)) {
      for (const period of day.busy.times) {
        const length = period.finish - period.start;
        day.total += length;
      }
    }
  }
}
