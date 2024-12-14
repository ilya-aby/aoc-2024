import fullData from '../assets/inputs/D14-input.txt?raw';
import sampleData from '../assets/inputs/D14-sample.txt?raw';
import formatDuration from '../utils/formatDuration';
import { GridViz } from '../utils/GridViz';

type Robot = {
  p: { row: number; col: number };
  v: { rowPerSec: number; colPerSec: number };
};

function wrap(value: number, max: number): number {
  // The ((value % max) + max) ensures we get a positive number first
  // The final % max handles cases where the value was already positive
  return ((value % max) + max) % max;
}

function computeSafetyFactor(robots: Robot[], numRows: number, numCols: number): number {
  // Initialize counters for each quadrant
  const midRow = Math.floor(numRows / 2);
  const midCol = Math.floor(numCols / 2);
  let topLeft = 0;
  let topRight = 0;
  let bottomLeft = 0;
  let bottomRight = 0;

  // Count robots in each quadrant, ignoring those on middle lines
  for (const robot of robots) {
    if (robot.p.row === midRow || robot.p.col === midCol) continue;

    if (robot.p.row < midRow) {
      // Top half
      if (robot.p.col < midCol) {
        topLeft++;
      } else {
        topRight++;
      }
    } else {
      // Bottom half
      if (robot.p.col < midCol) {
        bottomLeft++;
      } else {
        bottomRight++;
      }
    }
  }

  console.log(`Quadrant counts:
    Top Left: ${topLeft}
    Top Right: ${topRight}
    Bottom Left: ${bottomLeft}
    Bottom Right: ${bottomRight}`);

  return topLeft * topRight * bottomLeft * bottomRight;
}

function visualizeRobots(robots: Robot[], numRows: number, numCols: number): string[][] {
  // Create an empty grid
  const grid = Array(numRows)
    .fill(0)
    .map(() => Array(numCols).fill('.'));

  // Place robots on the grid
  for (const robot of robots) {
    const { row, col } = robot.p;
    // If multiple robots are on the same spot, increment the number
    if (grid[row][col] === '.') {
      grid[row][col] = '1';
    } else {
      const current = parseInt(grid[row][col]);
      grid[row][col] = (current + 1).toString();
    }
  }

  return grid;
}

function parseData(data: string): Robot[] {
  return data
    .trim()
    .split('\n')
    .map((line) => {
      const [posStr, velStr] = line.split(' ');
      // Extract numbers after 'p=' and 'v='
      const [col, row] = posStr.substring(2).split(',').map(Number);
      const [colPerSec, rowPerSec] = velStr.substring(2).split(',').map(Number);

      return {
        p: { row, col },
        v: { rowPerSec, colPerSec },
      };
    });
}

function D14P1(
  data: Robot[],
  numRows: number,
  numCols: number,
): { result: number; timing: number; grid: string[][] } {
  const start = performance.now();

  // Create a deep copy of the robots array
  const robots = data.map((robot) => ({
    p: { ...robot.p },
    v: { ...robot.v },
  }));

  console.log(`Starting robots:`, data);
  const ticks = 100;

  for (const robot of robots) {
    console.log(
      `Robot ${robot.p.row},${robot.p.col} moving ${robot.v.rowPerSec},${robot.v.colPerSec} for ${ticks} seconds`,
    );
    robot.p.row = wrap(robot.p.row + robot.v.rowPerSec * ticks, numRows);
    robot.p.col = wrap(robot.p.col + robot.v.colPerSec * ticks, numCols);
    console.log(`Robot ${robot.p.row},${robot.p.col} after ${ticks} seconds`);
  }

  const safetyFactor = computeSafetyFactor(robots, numRows, numCols);
  const grid = visualizeRobots(robots, numRows, numCols);
  console.log(`After ${ticks} seconds:`, robots);
  const timing = performance.now() - start;
  return { timing, result: safetyFactor, grid };
}

// Same as P1, but looking for a pattern where all robots are in distinct positions
function D14P2(
  data: Robot[],
  numRows: number,
  numCols: number,
): { result: number; timing: number } {
  const start = performance.now();

  // Create a deep copy of the robots array
  const robots = data.map((robot) => ({
    p: { ...robot.p },
    v: { ...robot.v },
  }));

  let tick = 0;
  const maxTicks = 1000000; // Prevent infinite loops

  while (tick < maxTicks) {
    // Move all robots one step
    for (const robot of robots) {
      robot.p.row = wrap(robot.p.row + robot.v.rowPerSec, numRows);
      robot.p.col = wrap(robot.p.col + robot.v.colPerSec, numCols);
    }
    tick++;

    // Check if all positions are unique
    const positions = new Set(robots.map((robot) => `${robot.p.row},${robot.p.col}`));
    if (positions.size === robots.length) {
      break;
    }
  }

  const timing = performance.now() - start;
  return {
    timing,
    result: tick === maxTicks ? -1 : tick,
  };
}

export default function D14({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const numRows = inputType === 'sample' ? 7 : 103;
  const numCols = inputType === 'sample' ? 11 : 101;
  const data = parseData(rawData);
  const response1 = D14P1(data, numRows, numCols);
  const response2 = D14P2(data, numRows, numCols);

  return (
    <>
      <p>
        Part 1: <span className='font-mono text-lime-500'>{response1.result}</span>
      </p>
      <p className='font-mono text-gray-500'>⏱️ {formatDuration(response1.timing)}</p>
      <GridViz className='p-2' grid={response1.grid} />
      <p>
        Part 2: <span className='font-mono text-lime-500'>{response2.result}</span>
      </p>
      <p className='font-mono text-gray-500'>⏱️ {formatDuration(response2.timing)}</p>
    </>
  );
}
