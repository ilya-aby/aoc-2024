// --- Day 14: Restroom Redoubt ---
// One of The Historians needs to use the bathroom; fortunately, you know there's a bathroom near an unvisited location on their list, and so you're all quickly teleported directly to the lobby of Easter Bunny Headquarters.

// Unfortunately, EBHQ seems to have "improved" bathroom security again after your last visit. The area outside the bathroom is swarming with robots!

// To get The Historian safely to the bathroom, you'll need a way to predict where the robots will be in the future. Fortunately, they all seem to be moving on the tile floor in predictable straight lines.

// You make a list (your puzzle input) of all of the robots' current positions (p) and velocities (v), one robot per line. For example:

// p=0,4 v=3,-3
// p=6,3 v=-1,-3
// p=10,3 v=-1,2
// p=2,0 v=2,-1
// p=0,0 v=1,3
// p=3,0 v=-2,-2
// p=7,6 v=-1,-3
// p=3,0 v=-1,-2
// p=9,3 v=2,3
// p=7,3 v=-1,2
// p=2,4 v=2,-3
// p=9,5 v=-3,-3
// Each robot's position is given as p=x,y where x represents the number of tiles the robot is from the left wall and y represents the number of tiles from the top wall (when viewed from above). So, a position of p=0,0 means the robot is all the way in the top-left corner.

// Each robot's velocity is given as v=x,y where x and y are given in tiles per second. Positive x means the robot is moving to the right, and positive y means the robot is moving down. So, a velocity of v=1,-2 means that each second, the robot moves 1 tile to the right and 2 tiles up.

// The robots outside the actual bathroom are in a space which is 101 tiles wide and 103 tiles tall (when viewed from above). However, in this example, the robots are in a space which is only 11 tiles wide and 7 tiles tall.

// The robots are good at navigating over/under each other (due to a combination of springs, extendable legs, and quadcopters), so they can share the same tile and don't interact with each other. Visually, the number of robots on each tile in this example looks like this:

// 1.12.......
// ...........
// ...........
// ......11.11
// 1.1........
// .........1.
// .......1...
// These robots have a unique feature for maximum bathroom security: they can teleport. When a robot would run into an edge of the space they're in, they instead teleport to the other side, effectively wrapping around the edges. Here is what robot p=2,4 v=2,-3 does for the first few seconds:

// Initial state:
// ...........
// ...........
// ...........
// ...........
// ..1........
// ...........
// ...........

// After 1 second:
// ...........
// ....1......
// ...........
// ...........
// ...........
// ...........
// ...........

// After 2 seconds:
// ...........
// ...........
// ...........
// ...........
// ...........
// ......1....
// ...........

// After 3 seconds:
// ...........
// ...........
// ........1..
// ...........
// ...........
// ...........
// ...........

// After 4 seconds:
// ...........
// ...........
// ...........
// ...........
// ...........
// ...........
// ..........1

// After 5 seconds:
// ...........
// ...........
// ...........
// .1.........
// ...........
// ...........
// ...........
// The Historian can't wait much longer, so you don't have to simulate the robots for very long. Where will the robots be after 100 seconds?

// In the above example, the number of robots on each tile after 100 seconds has elapsed looks like this:

// ......2..1.
// ...........
// 1..........
// .11........
// .....1.....
// ...12......
// .1....1....
// To determine the safest area, count the number of robots in each quadrant after 100 seconds. Robots that are exactly in the middle (horizontally or vertically) don't count as being in any quadrant, so the only relevant robots are:

// ..... 2..1.
// ..... .....
// 1.... .....

// ..... .....
// ...12 .....
// .1... 1....
// In this example, the quadrants contain 1, 3, 4, and 1 robot. Multiplying these together gives a total safety factor of 12.

// Predict the motion of the robots in your list within a space which is 101 tiles wide and 103 tiles tall. What will the safety factor be after exactly 100 seconds have elapsed?

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

function D14P2(data: Robot[]): { result: number; timing: number } {
  const start = performance.now();
  const result = data.length;
  const timing = performance.now() - start;
  return { timing, result };
}

export default function D14({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const numRows = inputType === 'sample' ? 7 : 103;
  const numCols = inputType === 'sample' ? 11 : 101;
  const data = parseData(rawData);
  const response1 = D14P1(data, numRows, numCols);
  const response2 = D14P2(data);

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
