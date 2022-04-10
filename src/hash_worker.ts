export class HashWorker {
  input: string;
  difficultyTarget: bigint;

  constructor(input: string, target: bigint) {
    this.input = input;
    this.difficultyTarget = target;
  }

  getTarget(): bigint {
    return this.difficultyTarget;
  }
}
