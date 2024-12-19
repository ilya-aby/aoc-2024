import fullData from '../assets/inputs/D22-input.txt?raw';
import sampleData from '../assets/inputs/D22-sample.txt?raw';
import formatDuration from '../utils/formatDuration';

function parseData(data: string): string[][] {
  return data
    .trim()
    .split('\n')
    .map((line) => line.split(''));
}

function DXP1(data: string[][]): { result: number; timing: number } {
  const start = performance.now();
  const result = data.length;
  const timing = performance.now() - start;
  return { timing, result };
}

function DXP2(data: string[][]): { result: number; timing: number } {
  const start = performance.now();
  const result = data.length;
  const timing = performance.now() - start;
  return { timing, result };
}

export default function DX({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const data = parseData(rawData);
  const response1 = DXP1(data);
  const response2 = DXP2(data);

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
