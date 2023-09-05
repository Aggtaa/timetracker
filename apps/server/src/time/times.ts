import { TimePeriod } from '@timetracker/types-lib';

export class Times {
  static contains(period: TimePeriod, time: number): boolean {
    return period.start <= time && period.finish >= time;
  }

  static overlaps(a: TimePeriod, b: TimePeriod): boolean {
    return Times.contains(a, b.start)
      || Times.contains(a, b.finish)
      || Times.contains(b, a.start)
      || Times.contains(b, a.finish);
  }
}
