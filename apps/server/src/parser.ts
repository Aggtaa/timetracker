import { Event } from '@prisma/client';
import moment from 'moment';
import { strToTokens, toDate } from './utils';

export type ParsedEvent = Pick<Event, 'day' | 'startHour' | 'startMinute' | 'finishHour' | 'finishMinute' | 'description'>;

type ParseData = {
  text: string,
  tokens: string[],
  day: Date,
  startHour: number,
  startMinute: number,
  finishHour: number,
  finishMinute: number,
}

export class Parser {

  private static extractDate(data: ParseData): void {

    data.text = data.text.trim();

    const tokens = strToTokens(data.text);

    // if text starts with time, dont try to look for a date
    if (tokens?.[0].text.match(/^\d\d:?\d\d$/))
      return;

    // console.dir(tokens);

    for (let i = 0; i < tokens.length; i++) {
      const text = tokens.slice(0, i + 1).map((t) => t.text).join(' ');
      const dt = moment(text, ['D.M', 'D M', 'M/D', 'D MMM'], true);
      if (dt.isValid()) {
        data.day = dt.toDate();
        data.text = data.text.substring(tokens[i].pos + tokens[i].fullLength);
        // console.dir({ i, [text]: dt.toISOString(), data });
        return;
      }
    }
  }

  private static extractTime(data: ParseData): void {

    data.text = data.text.replace(
      /^(\d?\d):?(\d\d)-(\d?\d):?(\d\d)/,
      (m, sh, sm, fh, fm) => {
        data.startHour = Number(sh);
        data.startMinute = Number(sm);
        data.finishHour = Number(fh);
        data.finishMinute = Number(fm);
        return '';
      },
    );
  }

  public static parseText(text: string, day: Date = new Date()): ParsedEvent {

    const data: ParseData = {
      text,
      tokens: [],
      day,
      startHour: 0,
      startMinute: 0,
      finishHour: 0,
      finishMinute: 0,
    };

    Parser.extractDate(data);
    Parser.extractTime(data);

    data.text = data.text.trim();

    return {
      day: toDate(data.day),
      startHour: data.startHour,
      startMinute: data.startMinute,
      finishHour: data.finishHour,
      finishMinute: data.finishMinute,
      description: data.text,
    };
  }
}
