import * as winston from 'winston';
import { createHash, randomBytes } from 'crypto';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'dev' ? 'debug' : 'info',
  format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  transports: [new winston.transports.Console()],
});

export class HashWorker {
  input: string;
  difficultyTarget: number;
  nonce?: string;
  result?: string;

  constructor(input: string, target: number, nonce?: string) {
    this.input = input;
    this.difficultyTarget = target;
    this.nonce = nonce;
  }

  getTarget(): number {
    return this.difficultyTarget;
  }

  doWork() {
    logger.info(`Starting work with input ${this.input}`);
    let iters = 0;
    do {
      iters++;
      this.nonce = randomBytes(8).toString('hex');
      this.result = createHash('sha256').update(this.input + this.nonce).digest('hex');
      logger.debug(`Resultant hash for iteration ${iters}: ${this.result}`);
    } while(Number('0x' + this.result) > this.difficultyTarget);
    logger.info(`Finished after ${iters} iterations`);
  }

  verify(nonce?: string) {
    let testNonce = nonce ? nonce : this.nonce;
    this.result = createHash('sha256').update(this.input + testNonce).digest('hex');
  }
}
