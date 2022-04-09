import { HashWorker } from '../src/hash_worker';
import { expect } from 'chai';

describe('hash worker', () => {
  it('should return a target value', () => {
    const target = 0x00FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    const hw = new HashWorker('foo', target);
    expect(hw.getTarget()).to.equal(target);
  });
});
