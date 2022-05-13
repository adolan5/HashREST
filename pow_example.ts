import { HashWorker, HashWorkerOptions } from './src/hash_worker';

type testResults = {
  duration: number;
  resultHash: string;
};

function runTest(input: string, target: bigint): testResults {
  const start = Date.now();
  let options: HashWorkerOptions = {
    target: target
  };

  let hw = new HashWorker(input, options);
  hw.doWork();
  const duration = (Date.now() - start) / 1000;
  console.log(`Finished trial in ${duration} seconds`);
  console.log(`Solution nonce: ${hw.nonce}`);
  console.log(`Resulting hash: ${hw.result}`);
  return { duration: duration, resultHash: hw.result! };
}

function adjustDifficulty(targetTime: number, avgTime: number, target: bigint): bigint {
  let newTarget: bigint;
  let absdiff = Math.abs(avgTime - targetTime);
  let diffProp = BigInt(Math.pow(Math.round(1 / (absdiff / targetTime)), 2) + 1);
  console.log(`Adjustment diffProp is ${diffProp}`);

  // ...
  if (avgTime < targetTime) {
    console.log('Increasing difficulty');
    newTarget = target - (target / diffProp);
  } else {
    console.log('Decreasing difficulty');
    newTarget = target + (target / diffProp);
  }
  return newTarget;
}

// Main routine

let input: string = 'foo';
let trialsToRun = 50;
let batches = 25;
let difficultyTime = 10;
// let target = (2n ** 240n) - 1n;
let target = (2n ** 256n) - 1n;
let duration = 0;

let durations = [];
let batchDurations = [];

for (let i = 0; i < trialsToRun; i++) {
  console.log(`\n\nStarting iteration ${i + 1}`);
  console.log(`Curent target is ${target.toString(16).padStart(64, '0')}`);
  for (let j = 0; j < batches; j++) {
    let results = runTest(input, target);
    durations.push(results.duration);
    batchDurations.push(results.duration);
    input = results.resultHash;
  }
  let meanBatchDuration = batchDurations.reduce((a,b) => a + b) / batchDurations.length;
  console.log(`Average duration for last ${batches} iterations: ${meanBatchDuration}`);
  target = adjustDifficulty(difficultyTime, meanBatchDuration, target);
  batchDurations.length = 0;
}

console.log('Finished experiment!');
console.log(durations);
console.log(`Average duration: ${durations.reduce((a,b) => { return a + b; }) / durations.length}`);
