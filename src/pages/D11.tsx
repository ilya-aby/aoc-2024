import fullData from '../assets/inputs/D11-input.txt?raw';
import sampleData from '../assets/inputs/D11-sample.txt?raw';
import { GridViz } from '../utils/GridViz';
import formatDuration from '../utils/formatDuration';

function parseData(data: string): number[] {
  return data.trim().split(' ').map(Number);
}

function transformStone(stone: number, memo: Map<number, number[]> = new Map()): number[] {
  // Check cache for this individual stone
  if (memo.has(stone)) {
    return memo.get(stone)!;
  }

  let result: number[];

  // Apply transformation rules
  if (stone === 0) {
    result = [1];
  } else if (String(stone).length % 2 === 0) {
    const halfLength = String(stone).length / 2;
    result = [
      parseInt(String(stone).slice(0, halfLength)),
      parseInt(String(stone).slice(halfLength)),
    ];
  } else {
    result = [stone * 2024];
  }

  // Cache the result for this stone
  memo.set(stone, result);
  return result;
}

function transformStones(
  data: number[],
  stepsLeft: number,
  memo: Map<number, number[]> = new Map(),
): number[] {
  if (stepsLeft === 0) {
    return data;
  }

  // Transform each stone individually using the cache
  const newStones = data.flatMap((stone) => transformStone(stone, memo));

  // Continue with remaining steps
  return transformStones(newStones, stepsLeft - 1, memo);
}

function D11P1(data: number[]): { result: number; stones: number[]; timing: number } {
  const start = performance.now();
  const result = transformStones(data, 25);
  const timing = performance.now() - start;
  return { timing, result: result.length, stones: result };
}

function D11P2(data: number[]): { result: number; stones: number[]; timing: number } {
  const start = performance.now();
  const result = transformStones(data, 26);
  const timing = performance.now() - start;
  return { timing, result: result.length, stones: result };
}

export default function D11({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const data = parseData(rawData);
  const response1 = D11P1(data);
  const response2 = D11P2(data);

  return (
    <>
      <p>
        Part 1: <span className='font-mono text-lime-500'>{response1.result}</span>
      </p>
      <p className='font-mono text-gray-500'>⏱️ {formatDuration(response1.timing)}</p>
      <GridViz className='mt-4' grid={[response1.stones]} />
      <p className='mt-4'>
        Part 2: <span className='font-mono text-lime-500'>{response2.result}</span>
      </p>
      <p className='font-mono text-gray-500'>⏱️ {formatDuration(response2.timing)}</p>
    </>
  );
}
