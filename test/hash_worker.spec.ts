import { HashWorker } from '../src/hash_worker';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('hash worker', () => {
  it('should return a target value', () => {
    const target: bigint = BigInt(0x00FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF);
    const hw = new HashWorker('foo', target);
    expect(hw.getTarget()).to.equal(target);
  });
});
