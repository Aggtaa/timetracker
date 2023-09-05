import { Event, Prisma } from '@prisma/client';
import { DayStatistics, Statistics } from '@timetracker/types-lib';
import {
  microservice, method, z,
} from 'nats-micro';

import { prisma } from '../prisma';
import { Days } from '../time/days';
import { firstDayOfWeek, toDate } from '../utils';

const dayRequestSchema = z.object({ date: z.date() });
type DayRequest = z.infer<typeof dayRequestSchema>;

const weekRequestSchema = z.object({ date: z.date().optional() });
type WeekRequest = z.infer<typeof weekRequestSchema>;

@microservice()
export default class StatisticsMicroservice {

  @method()
  public async day(req: DayRequest): Promise<Statistics | undefined> {

    const day = toDate(req.date);

    return this.get({ day });
  }

  @method()
  public async today(): Promise<Statistics | undefined> {

    return this.get({ day: toDate(new Date()) });
  }

  @method()
  public async week(req: WeekRequest): Promise<Statistics | undefined> {

    const start = firstDayOfWeek(req.date || new Date());
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);

    return this.get({ day: { gte: start, lte: end } });
  }

  @method()
  public async all(): Promise<Statistics | undefined> {

    return this.get({});
  }

  @method()
  public async get(filter: Prisma.EventWhereInput): Promise<Statistics | undefined> {

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
