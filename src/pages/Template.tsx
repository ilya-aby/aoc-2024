import fullData from '../assets/inputs/DX-input.txt?raw';
import sampleData from '../assets/inputs/DX-sample.txt?raw';

function DXP1(data: string): number {
  const line = data.trim();

  return line.length;
}

function DXP2(data: string): number {
  const line = data.trim();

  return line.length;
}

export default function DX({ inputType }: { inputType: 'sample' | 'full' }) {
  const data = inputType === 'sample' ? sampleData : fullData;

  return (
    <>
      <h1>Day X</h1>
      <p>
        Part 1: <span className='font-mono text-lime-500'>{DXP1(data)}</span>
      </p>
      <p>
        Part 2: <span className='font-mono text-lime-500'>{DXP2(data)}</span>
      </p>
    </>
  );
}
