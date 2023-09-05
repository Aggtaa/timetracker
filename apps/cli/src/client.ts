import { DayStatistics, Statistics } from '@timetracker/types-lib';
import { Broker } from 'nats-micro';

export class Client {
  private broker: Broker;

  async connect() {
    this.broker = await new Broker('test' + process.pid).connect();
  }

  async disconnect() {
    this.broker.disconnect();
  }

  private call<T, R>(microservice: string, method: string, data: T): Promise<R> {
    return this.broker.exec('cli', { microservice, method }, data);
  }

  private callEvents<T, R>(method: string, data: T): Promise<R> {
    return this.call('events', method, data);
  }

  private callStatistics<T, R>(method: string, data: T): Promise<R> {
    return this.call('statistics', method, data);
  }

  public async addEvent(text: string): Promise<any> {
    const result = await this.callEvents('add', { text });
    return result;
  }

  public async getTodayStats(): Promise<DayStatistics> {
    const result = await this.callStatistics('today', {}) as Statistics;
    return result.days[0];
  }
}
