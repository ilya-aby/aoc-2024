import fullData from '../assets/inputs/D11-input.txt?raw';
import sampleData from '../assets/inputs/D11-sample.txt?raw';
import formatDuration from '../utils/formatDuration';

function parseData(data: string): number[] {
  return data.trim().split(' ').map(Number);
}

function calculateFinalLength(
  stone: number,
  steps: number,
  memo: Map<string, number> = new Map(),
): number {
  const key = `${stone}-${steps}`;
  if (memo.has(key)) return memo.get(key)!;
  if (steps === 0) return 1;

  let result: number;
  if (stone === 0) {
    // 0 becomes 1, then follow pattern for 1
    result = calculateFinalLength(1, steps - 1, memo);
  } else if (String(stone).length % 2 === 0) {
    // Even-length numbers split into two numbers
    const halfLength = String(stone).length / 2;
    const num1 = parseInt(String(stone).slice(0, halfLength));
    const num2 = parseInt(String(stone).slice(halfLength));
    result =
      calculateFinalLength(num1, steps - 1, memo) + calculateFinalLength(num2, steps - 1, memo);
  } else {
    // Odd-length numbers multiply by 2024
    result = calculateFinalLength(stone * 2024, steps - 1, memo);
  }

  memo.set(key, result);
  return result;
}

function D11P1(data: number[]): { result: number; timing: number } {
  const start = performance.now();
  const result = data.reduce((sum, stone) => sum + calculateFinalLength(stone, 25), 0);
  const timing = performance.now() - start;
  return { timing, result };
}

function D11P2(data: number[]): { result: number; timing: number } {
  const start = performance.now();
  const result = data.reduce((sum, stone) => sum + calculateFinalLength(stone, 75), 0);
  const timing = performance.now() - start;
  return { timing, result };
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
      <p className='mt-4'>
        Part 2: <span className='font-mono text-lime-500'>{response2.result}</span>
      </p>
      <p className='font-mono text-gray-500'>⏱️ {formatDuration(response2.timing)}</p>
    </>
  );
}
