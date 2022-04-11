import { HashWorker } from '../src/hash_worker';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('hash worker', () => {
  const input = 'foo';
  const target: bigint = BigInt(0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF);

  it('should return a target value', () => {
    let hw = new HashWorker(input, target);
    expect(hw.getTarget()).to.equal(target);
  });

  it('should generate a hash that is less than the specified target difficulty', () => {
    let hw = new HashWorker(input, target);
    expect(() => hw.doWork()).to.not.throw();
    // Regular .below() assertion does not work with BigInt
    expect(BigInt('0x' + hw.result) < target);
  });

  // TODO
  it('should throw an error when timing out', () => {
  });

  it('should verify an existing result', () => {
    let nonce = '8451104d8488b3b6';
    let hw = new HashWorker(input, target, nonce);
    expect(() => hw.verify()).to.not.throw();
    expect(hw.result).to.equal('0b95f00efb7ae9deaf2feb7f2928b19bcc50e65af0afb55bd94fbee62c081d76');

    let otherHw = new HashWorker(input, target);
    expect(() => otherHw.verify(nonce)).to.not.throw();
    expect(hw.result).to.equal('0b95f00efb7ae9deaf2feb7f2928b19bcc50e65af0afb55bd94fbee62c081d76');
  });
});
