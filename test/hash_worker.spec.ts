import { HashWorker } from '../src/hash_worker';
import { expect } from 'chai';
import * as sinon from 'sinon';

afterEach(() => {
  sinon.restore();
});

describe('hash worker', () => {
  const target: number = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;

  it('should return a target value', () => {
    const hw = new HashWorker('foo', target);
    expect(hw.getTarget()).to.equal(target);
  });

  it('should generate a hash that is less than the specified target difficulty', () => {
    const input = 'foo';
    const hw = new HashWorker(input, target);
    expect(() => hw.doWork()).to.not.throw();
    expect(Number('0x' + hw.result)).to.be.below(target);
  });
});
