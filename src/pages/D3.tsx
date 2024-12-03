import sampleData from '../assets/inputs/D3-input.txt?raw';

function D3P1(): number {
  const line = sampleData.trim();

  const regex = /mul\((\d+),(\d+)\)/g;
  const matches = [...line.matchAll(regex)];

  console.log(matches);

  let runningProduct = 0;
  for (const match of matches) {
    runningProduct += Number(match[1]) * Number(match[2]);
  }

  return runningProduct;
}

function D3P2(): number {
  // Add 'do()' to the beginning of the line to ensure the first match is a do()
  const line = 'do()' + sampleData.trim();

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

export default function D2() {
  return (
    <>
      <h1>Day 3</h1>
      <p>
        Multiplication sum: <span className='font-mono text-lime-500'>{D3P1()}</span>
      </p>
      <p>
        Multiplication sum with do() and don't():{' '}
        <span className='font-mono text-lime-500'>{D3P2()}</span>
      </p>
    </>
  );
}
