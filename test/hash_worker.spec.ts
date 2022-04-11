import { HashWorker, HashWorkerOptions } from '../src/hash_worker';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('hash worker', () => {
  const input = 'foo';
  let options: HashWorkerOptions = {
    target: BigInt(0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
  };
  let hw: HashWorker;

  beforeEach(() => {
    hw = new HashWorker(input, options);
  });

  it('should return a target value', () => {
    let hw = new HashWorker(input, options);
    expect(hw.getTarget()).to.equal(options.target);
  });

  it('should generate a hash that is less than the specified target difficulty', () => {
    let hw = new HashWorker(input, options);
    expect(() => hw.doWork()).to.not.throw();
    // Regular .below() assertion does not work with BigInt
    expect(BigInt('0x' + hw.result) < options.target);
  });

  // TODO
  it('should throw an error when timing out', () => {
    let crazyTarget = BigInt(0xFF);
    let timeout = 2;
    // TODO: Update options with parameters
    let hw = new HashWorker(input, options);
  });

  it('should verify an existing result', () => {
    let testNonce = '8451104d8488b3b6';
    let hw = new HashWorker(input, options, testNonce);
    expect(() => hw.verify()).to.not.throw();
    expect(hw.result).to.equal('0b95f00efb7ae9deaf2feb7f2928b19bcc50e65af0afb55bd94fbee62c081d76');

    let otherHw = new HashWorker(input, options);
    expect(() => otherHw.verify(testNonce)).to.not.throw();
    expect(hw.result).to.equal('0b95f00efb7ae9deaf2feb7f2928b19bcc50e65af0afb55bd94fbee62c081d76');
  });
});
