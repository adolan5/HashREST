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
  nonce?: string;
};

export class HashWorker {
  input: string;
  options: HashWorkerOptions;
  result?: string;

  constructor(input: string, options: HashWorkerOptions) {
    this.input = input;
    this.options = options;
    if (!this.options.timeout)
      this.options.timeout = 600;
  }

  getTarget(): bigint {
    return this.options.target;
  }

  doWork() {
    logger.info(`Starting work with input ${this.input}`);
    let iters = 0;
    do {
      iters++;
      this.options.nonce = randomBytes(8).toString('hex');
      this.result = createHash('sha256').update(this.input + this.options.nonce).digest('hex');
      logger.debug(`Resultant hash for iteration ${iters}: ${this.result}`);
    } while(Number('0x' + this.result) > this.options.target);
    logger.info(`Finished after ${iters} iterations`);
  }

  verify(nonce?: string) {
    let testNonce = nonce ? nonce : this.options.nonce;
    this.result = createHash('sha256').update(this.input + testNonce).digest('hex');
  }
}
