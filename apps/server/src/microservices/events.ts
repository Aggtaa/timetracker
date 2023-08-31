import { Event } from '@prisma/client';
import {
  microservice, method, z,
} from 'nats-micro';

import { Parser } from '../parser';
import { prisma } from '../prisma';

const addEventSchema = z.object({ text: z.string() });
type AddEventRequest = z.infer<typeof addEventSchema>;

const editEventSchema = z.object({ id: z.string(), text: z.string() });
type EditEventRequest = z.infer<typeof editEventSchema>;

const getEventSchema = z.object({ id: z.string() });
type GetEventRequest = z.infer<typeof getEventSchema>;

const deleteEventSchema = z.object({ id: z.string() });
type DeleteEventRequest = z.infer<typeof deleteEventSchema>;

const reparseEventSchema = z.object({ id: z.string() });
type ReparseEventRequest = z.infer<typeof reparseEventSchema>;

@microservice()
export default class EventsMicroservice {

  @method({ name: 'get' })
  public async getEvent(req: GetEventRequest): Promise<Event | undefined> {
    console.log(`getEvent ${JSON.stringify(req)}`);

    const event = await prisma.event.findFirst({ where: { id: req.id } });
    return event;
  }

  @method({ name: 'add' })
  public async addEvent(req: AddEventRequest): Promise<Event> {
    console.log(`addEvent ${JSON.stringify(req)}`);

    const parsedEvent = await Parser.parseText(req.text);

    const event = await prisma.event.create({
      data: {
        text: req.text,
        ...parsedEvent,
      },
    });

    return event;
  }

  @method({ name: 'edit' })
  public async editEvent(req: EditEventRequest): Promise<Event | undefined> {
    console.log(`editEvent ${JSON.stringify(req)}`);

    const parsedEvent = await Parser.parseText(req.text);

    const event = await prisma.event.update({
      data: {
        text: req.text,
        ...parsedEvent,
      },
      where: {
        id: req.id,
      },
    });

    return event;
  }

  @method({ name: 'refresh' })
  public async refreshEvent(req: ReparseEventRequest): Promise<Event | undefined> {
    console.log(`refreshEvent ${JSON.stringify(req)}`);

    const oldEvent = await this.getEvent({ id: req.id });
    if (!oldEvent)
      return undefined;

    return this.editEvent({ ...req, text: oldEvent.text });
  }

  @method({ name: 'delete' })
  public async deleteEvent(req: DeleteEventRequest): Promise<boolean> {
    console.log(`deleteEvent ${JSON.stringify(req)}`);

    const event = await prisma.event.delete({
      where: {
        id: req.id,
      },
    });

    return !!event;
  }

  @method({ name: 'list' })
  public async listEvents(): Promise<Event[]> {
    console.log('listEvents');

    const events = await prisma.event.findMany({
    });

    return events;
  }
}
