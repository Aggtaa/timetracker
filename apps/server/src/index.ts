import { Broker, Microservice } from 'nats-micro';

import EventsMicroservice from './microservices/events';
// import ParserMicroservice from './microservices/parser';

(async () => {

  const events = new EventsMicroservice();
  // const parser = new ParserMicroservice();

  const broker = await new Broker('test' + process.pid).connect();
  await Microservice.createFromClass(broker, events);
  // await Microservice.createFromClass(broker, parser);
})()
  .catch(console.error);
