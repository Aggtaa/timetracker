import { TimePeriod } from '@timetracker/types-lib';
import moment from 'moment';

export function formatDuration(duration: number): string {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  console.dir({ duration, hours, minutes });

  const parts: string[] = [];

  if (hours !== 0)
    parts.push(moment.duration({ hours }).humanize());
  if (minutes !== 0)
    parts.push(moment.duration({ minutes }).humanize());

  return parts.join(' and ');
}

export function formatTime(time: number): string {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;

  return `${hours.toFixed(0).padStart(2, '00')}:${minutes.toFixed(0).padStart(2, '00')}`;
}

export function formatTimePeriod(period: TimePeriod): string {
  const length = period.finish - period.start;
  return `${formatTime(period.start)}${length > 0 ? '-' + formatTime(period.finish) : ''}${length > 0 ? ', ' : ''}${formatDuration(length)}`;
}

export function formatDate(date: Date): string {
  return moment(date).format('ll');
}
