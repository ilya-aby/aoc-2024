import fullData from '../assets/inputs/D4-input.txt?raw';
import sampleData from '../assets/inputs/D4-sample.txt?raw';

function D4P1(data: string): number {
  const grid = data
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((row) => row.split(''));

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1], // top-left, top, top-right
    [0, -1],
    [0, 1], // left, right
    [1, -1],
    [1, 0],
    [1, 1], // bottom-left, bottom, bottom-right
  ];

  function findXMAS(x: number, y: number): number {
    if (grid[x]?.[y] !== 'X') return 0;

    let count = 0;
    for (const [dx, dy] of directions) {
      // Check if "MAS" exists in this direction
      const m = grid[x + dx]?.[y + dy];
      const a = grid[x + 2 * dx]?.[y + 2 * dy];
      const s = grid[x + 3 * dx]?.[y + 3 * dy];

      if (m === 'M' && a === 'A' && s === 'S') {
        count++;
      }
    }
    return count;
  }

  let total = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      total += findXMAS(i, j);
    }
  }
  return total;
}

function D4P2(data: string): number {
  const grid = data
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((row) => row.split(''));

  function checkXMAS(x: number, y: number): number {
    // Check if we have an 'A' at the center
    if (grid[x]?.[y] !== 'A') return 0;

    // Check all four corners around the 'A'
    const topLeft = grid[x - 1]?.[y - 1];
    const topRight = grid[x - 1]?.[y + 1];
    const bottomLeft = grid[x + 1]?.[y - 1];
    const bottomRight = grid[x + 1]?.[y + 1];

    // Check if we have valid diagonal patterns
    const hasValidPattern =
      // Check top-left to bottom-right diagonal
      ((topLeft === 'M' && bottomRight === 'S') || (topLeft === 'S' && bottomRight === 'M')) &&
      // Check top-right to bottom-left diagonal
      ((topRight === 'M' && bottomLeft === 'S') || (topRight === 'S' && bottomLeft === 'M'));

    return hasValidPattern ? 1 : 0;
  }

  let xmasCount = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      xmasCount += checkXMAS(i, j);
    }
  }

  return xmasCount;
}

export default function D4({ inputType }: { inputType: 'sample' | 'full' }) {
  const data = inputType === 'sample' ? sampleData : fullData;

  return (
    <>
      <p>
        Part 1: <span className='font-mono text-lime-500'>{D4P1(data)}</span>
      </p>
      <p>
        Part 2: <span className='font-mono text-lime-500'>{D4P2(data)}</span>
      </p>
    </>
  );
}
