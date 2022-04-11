import * as winston from 'winston';
import { createHash, randomBytes } from 'crypto';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'dev' ? 'debug' : 'info',
  format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  transports: [new winston.transports.Console()],
});

export type HashWorkerOptions = {
  target: bigint;
  timeout?: number;
};

export class HashWorker {
  input: string;
  options: HashWorkerOptions;
  result?: string;
  nonce?: string;

  constructor(input: string, options: HashWorkerOptions, verifyNonce?: string) {
    this.input = input;
    this.options = options;
    if (!this.options.timeout)
      this.options.timeout = 600;
    if (verifyNonce)
      this.nonce = verifyNonce;
  }

  getTarget(): bigint {
    return this.options.target;
  }

  doWork() {
    // TODO if this.nonce, verify and return
    logger.info(`Starting work with input ${this.input}`);
    let iters = 0;
    do {
      iters++;
      this.nonce = randomBytes(8).toString('hex');
      this.result = createHash('sha256').update(this.input + this.nonce).digest('hex');
      logger.debug(`Resultant hash for iteration ${iters}: ${this.result}`);
    } while(Number('0x' + this.result) > this.options.target);
    logger.info(`Finished after ${iters} iterations`);
  }

  verify(nonce?: string) {
    let testNonce = nonce ? nonce : this.nonce;
    this.result = createHash('sha256').update(this.input + testNonce).digest('hex');
  }
}
