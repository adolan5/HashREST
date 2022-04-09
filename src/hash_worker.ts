export class HashWorker {
  input: string;
  difficultyTarget: number;

  constructor(input: string, target: number) {
    this.input = input;
    this.difficultyTarget = target;
  }

  getTarget(): number {
    return this.difficultyTarget;
  }
}
