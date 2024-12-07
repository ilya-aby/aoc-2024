import fullData from '../assets/inputs/DX-input.txt?raw';
import sampleData from '../assets/inputs/DX-sample.txt?raw';

function parseData(data: string): string[][] {
  return data
    .trim()
    .split('\n')
    .map((line) => line.split(''));
}

function DXP1(data: string[][]): number {
  return data.length;
}

function DXP2(data: string[][]): number {
  return data.length;
}

export default function DX({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const data = parseData(rawData);

  return (
    <>
      <p>
        Part 1: <span className='font-mono text-lime-500'>{DXP1(data)}</span>
      </p>
      <p>
        Part 2: <span className='font-mono text-lime-500'>{DXP2(data)}</span>
      </p>
    </>
  );
}
