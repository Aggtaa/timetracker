import { Broker, Microservice } from 'nats-micro';

import EventsMicroservice from './microservices/events';
import StatisticsMicroservice from './microservices/statistics';

(async () => {

  const events = new EventsMicroservice();
  const statistics = new StatisticsMicroservice();

  const broker = await new Broker('server' + process.pid).connect();
  await Microservice.createFromClass(broker, events);
  await Microservice.createFromClass(broker, statistics);
})()
  .catch(console.error);
