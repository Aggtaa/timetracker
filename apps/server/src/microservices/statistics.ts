import { Event, Prisma } from '@prisma/client';
// import { EventWhereInput } from '@prisma/client/';
import {
  microservice, method, z,
} from 'nats-micro';

import { prisma } from '../prisma';
import { DayStatistics, Days } from '../time/days';
import { TimePeriod } from '../types';
import { firstDayOfWeek, toDate } from '../utils';

const dayRequestSchema = z.object({ date: z.date() });
type DayRequest = z.infer<typeof dayRequestSchema>;

const weekRequestSchema = z.object({ date: z.date().optional() });
type WeekRequest = z.infer<typeof weekRequestSchema>;

type DayStats = {
  events: Event[];
  days: DayStatistics<TimePeriod[]>[];
}

@microservice()
export default class StatisticsMicroservice {

  @method()
  public async day(req: DayRequest): Promise<DayStats | undefined> {

    const day = toDate(req.date);

    return this.get({ day });
  }

  @method()
  public async today(): Promise<DayStats | undefined> {

    return this.get({ day: toDate(new Date()) });
  }

  @method()
  public async week(req: WeekRequest): Promise<DayStats | undefined> {

    const start = firstDayOfWeek(req.date || new Date());
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);

    return this.get({ day: { gte: start, lte: end } });
  }

  @method()
  public async all(): Promise<DayStats | undefined> {

    return this.get({});
  }

  @method()
  public async get(filter: Prisma.EventWhereInput): Promise<DayStats | undefined> {

    const events = await prisma.event.findMany({ where: filter });

    const days = new Days();
    days.add(...events);

    const stats = {
      events,
      days: days.days.map((d) => ({ ...d, busy: d.busy.times })),
    };

    return stats;
  }
}
