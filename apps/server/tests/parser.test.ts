import { expect } from 'chai';

import { Parser } from '../src/parser';
import { mkDate, toDate } from '../src/utils';

const today = toDate(new Date());

type Test = [string, Date, number, number, number, number, string];

function testParse(...snapshots: Test[]): void {
  for (const snapshot of snapshots) {
    it(snapshot[0], async function () {
      const data = Parser.parseText(snapshot[0]);

      expect(data.day.toISOString()).to.equal(snapshot[1].toISOString());

      expect(data.startHour).to.equal(snapshot[2]);
      expect(data.startMinute).to.equal(snapshot[3]);
      expect(data.finishHour).to.equal(snapshot[4]);
      expect(data.finishMinute).to.equal(snapshot[5]);

      expect(data.description).to.equal(snapshot[6]);
    });
  }
}

describe('parser', function () {

  describe('no time', function () {
    testParse(
      ['test 15.15', today, 0, 0, 0, 0, 'test 15.15'],
    );
  });

  describe('times', function () {
    testParse(
      ['0900-1100 test', today, 9, 0, 11, 0, 'test'],
      ['09:00-11:00 test', today, 9, 0, 11, 0, 'test'],
    );
  });

  describe('dates', function () {
    testParse(
      ['30.05 09:00-11:00 test', mkDate(30, 5), 9, 0, 11, 0, 'test'],
      ['1.5 09:00-11:00 test', mkDate(1, 5), 9, 0, 11, 0, 'test'],
      ['5/30 09:00-11:00 test', mkDate(30, 5), 9, 0, 11, 0, 'test'],
      ['30.05 09:00-11:00', mkDate(30, 5), 9, 0, 11, 0, ''],
    );
  });
});
