import fullData from '../assets/inputs/D7-input.txt?raw';
import sampleData from '../assets/inputs/D7-sample.txt?raw';

function parseData(data: string): [number, number[]][] {
  return data
    .trim()
    .split('\n')
    .map((line) => {
      const [id, numbers] = line.split(': ');
      return [parseInt(id), numbers.split(' ').map((num) => parseInt(num))];
    });
}

function D7P1(data: [number, number[]][]): number {
  let sum = 0;

  function canBeTrue(data: [number, number[]], accumulator: number): boolean {
    const target = data[0];
    const operands = data[1];

    if (operands.length === 0 && accumulator === target) {
      return true;
    } else if (operands.length === 0 || target < accumulator) {
      return false;
    }

    const nextOperand = operands[0];

    return (
      canBeTrue([target, operands.slice(1)], accumulator + nextOperand) ||
      canBeTrue([target, operands.slice(1)], accumulator * nextOperand)
    );
  }

  for (const row of data) {
    console.log(`Testing: ${row}`);
    if (canBeTrue(row, 0)) {
      console.log(`True: ${row}`);
      sum += row[0];
    }
  }

  return sum;
}

function D7P2(data: [number, number[]][]): number {
  let sum = 0;

  function canBeTrue(data: [number, number[]], accumulator: number): boolean {
    const target = data[0];
    const operands = data[1];

    if (operands.length === 0 && accumulator === target) {
      return true;
    } else if (operands.length === 0 || target < accumulator) {
      return false;
    }

    const nextOperand = operands[0];

    return (
      canBeTrue([target, operands.slice(1)], accumulator + nextOperand) ||
      canBeTrue([target, operands.slice(1)], accumulator * nextOperand) ||
      canBeTrue([target, operands.slice(1)], Number(`${accumulator}${nextOperand}`))
    );
  }

  for (const row of data) {
    console.log(`Testing: ${row}`);
    if (canBeTrue(row, 0)) {
      console.log(`True: ${row}`);
      sum += row[0];
    }
  }

  return sum;
}

export default function D7({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const data = parseData(rawData);

  return (
    <>
      <p>
        Part 1: <span className='font-mono text-lime-500'>{D7P1(data)}</span>
      </p>
      <p>
        Part 2: <span className='font-mono text-lime-500'>{D7P2(data)}</span>
      </p>
    </>
  );
}
