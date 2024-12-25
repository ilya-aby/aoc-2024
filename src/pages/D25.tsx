import fullData from '../assets/inputs/D25-input.txt?raw';
import sampleData from '../assets/inputs/D25-sample.txt?raw';
import formatDuration from '../utils/formatDuration';

type Key = {
  type: 'key';
  pattern: string;
};

type Lock = {
  type: 'lock';
  pattern: string;
};

function getColumnCounts(grid: string[][]): string {
  const height = grid.length;
  const width = grid[0].length;
  const counts: number[] = [];

  // For each column
  for (let x = 0; x < width; x++) {
    let count = 0;
    // Count # in each column, skipping first AND last row
    for (let y = 1; y < height - 1; y++) {
      if (grid[y][x] === '#') count++;
    }
    counts.push(count);
  }

  return counts.join(',');
}

function parseData(data: string): { keys: Key[]; locks: Lock[] } {
  // Split into sections (double newline)
  const sections = data.trim().split('\n\n');
  const keys: Key[] = [];
  const locks: Lock[] = [];

  sections.forEach((section) => {
    // Convert section to grid
    const grid = section.split('\n').map((line) => line.split(''));
    const pattern = getColumnCounts(grid);

    // Sort into appropriate array based on first character
    if (grid[0][0] === '#') {
      locks.push({ type: 'lock', pattern });
    } else {
      keys.push({ type: 'key', pattern });
    }
  });

  return { keys, locks };
}

function D25P1(data: { keys: Key[]; locks: Lock[] }): { result: number; timing: number } {
  const start = performance.now();

  let matches = 0;

  // Loop through each key and lock combination
  for (const key of data.keys) {
    for (const lock of data.locks) {
      console.log('\nChecking combination:');
      console.log('Key pattern:', key.pattern);
      console.log('Lock pattern:', lock.pattern);

      // Split patterns into arrays of numbers
      const keyNums = key.pattern.split(',').map(Number);
      const lockNums = lock.pattern.split(',').map(Number);

      // Check if all corresponding values sum to less than 5
      const isMatch = keyNums.every((keyNum, i) => {
        const lockNum = lockNums[i];
        const sum = keyNum + lockNum;
        console.log(
          `Position ${i}: ${keyNum} + ${lockNum} = ${sum} (${sum < 6 ? 'valid' : 'invalid'})`,
        );
        return sum < 6;
      });

      if (isMatch) {
        console.log('✅ MATCH FOUND!');
        matches++;
      } else {
        console.log('❌ No match');
      }
    }
  }

  const timing = performance.now() - start;
  return { timing, result: matches };
}

export default function D25({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const data = parseData(rawData);
  const response1 = D25P1(data);

  return (
    <>
      <p>
        Part 1: <span className='font-mono text-lime-500'>{response1.result}</span>
      </p>
      <p className='font-mono text-gray-500'>⏱️ {formatDuration(response1.timing)}</p>
    </>
  );
}
