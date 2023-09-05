import { Command } from 'commander';

import { Client } from './client';
import { formatEvent } from './format/event';
import { formatDay } from './format/day';

const client = new Client();

const program = new Command();

program
  .name('Time Tracker')
  .version('1.0.0')
  .description('Time Tracker CLI app');

program
  .command('add')
  .description('Parse text and add an event')
  .arguments('<text>')
  .action(async (str) => {
    const ev = await client.addEvent(str);
    console.log(formatEvent(ev));
  });

program
  .command('today')
  .description('Show today statistics')
  .action(async () => {
    const stats = await client.getTodayStats();
    console.log(formatDay(stats, { event: { id: false } }));
  });

(async () => {
  await client.connect();

  await program.parseAsync(process.argv);

  await client.disconnect();
})()
  .catch(console.error);
