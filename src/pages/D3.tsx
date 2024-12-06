import fullData from '../assets/inputs/D3-input.txt?raw';
import sampleData from '../assets/inputs/D3-sample.txt?raw';

function D3P1(data: string): number {
  const line = data.trim();

  const regex = /mul\((\d+),(\d+)\)/g;
  const matches = [...line.matchAll(regex)];

  console.log(matches);

  let runningProduct = 0;
  for (const match of matches) {
    runningProduct += Number(match[1]) * Number(match[2]);
  }

  return runningProduct;
}

function D3P2(data: string): number {
  // Add 'do()' to the beginning of the line to ensure the first match is a do()
  const line = 'do()' + data.trim();

  const instructionRegex = /mul\((\d+),(\d+)\)/g;

  const doRegex = /do\(\)/g;
  const doMatches = [...line.matchAll(doRegex)];

  const dontRegex = /don't\(\)/g;
  const dontMatches = [...line.matchAll(dontRegex)];

  const allMatches = [...doMatches, ...dontMatches].sort((a, b) => a.index! - b.index!);

  console.log(allMatches);
  let runningProduct = 0;

  for (const [index, match] of allMatches.entries()) {
    // Heuristic: grab everything from the do() to the next do() or don't()
    if (match[0] === 'do()') {
      const instruction = line.slice(match.index, allMatches[index + 1]?.index);
      const matches = [...instruction.matchAll(instructionRegex)];
      for (const match of matches) {
        runningProduct += Number(match[1]) * Number(match[2]);
      }
    }
  }

  return runningProduct;
}

export default function D3({ inputType }: { inputType: 'sample' | 'full' }) {
  const data = inputType === 'sample' ? sampleData : fullData;

  return (
    <>
      <p>
        Multiplication sum: <span className='font-mono text-lime-500'>{D3P1(data)}</span>
      </p>
      <p>
        Multiplication sum with do() and don't():{' '}
        <span className='font-mono text-lime-500'>{D3P2(data)}</span>
      </p>
    </>
  );
}
