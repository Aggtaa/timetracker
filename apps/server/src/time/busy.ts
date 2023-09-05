import { TimePeriod } from '@timetracker/types-lib';

import { Times } from './times';

export class Busy {
  public readonly times: TimePeriod[] = [];

  public add(time: TimePeriod): void {
    try {
      for (const overlapping of this.times)
        if (Times.overlaps(time, overlapping)) {
          if (time.start < overlapping.start)
            overlapping.start = time.start;
          if (time.finish > overlapping.finish)
            overlapping.finish = time.finish;
          return;
        }

      this.times.push({ start: time.start, finish: time.finish });
    }
    finally {
      this.times.sort((a, b) => a.start - b.start);
    }
  }
}
