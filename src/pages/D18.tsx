// --- Day 18: RAM Run ---
// You and The Historians look a lot more pixelated than you remember. You're inside a computer at the North Pole!

// Just as you're about to check out your surroundings, a program runs up to you. "This region of memory isn't safe! The User misunderstood what a pushdown automaton is and their algorithm is pushing whole bytes down on top of us! Run!"

// The algorithm is fast - it's going to cause a byte to fall into your memory space once every nanosecond! Fortunately, you're faster, and by quickly scanning the algorithm, you create a list of which bytes will fall (your puzzle input) in the order they'll land in your memory space.

// Your memory space is a two-dimensional grid with coordinates that range from 0 to 70 both horizontally and vertically. However, for the sake of example, suppose you're on a smaller grid with coordinates that range from 0 to 6 and the following list of incoming byte positions:

// 5,4
// 4,2
// 4,5
// 3,0
// 2,1
// 6,3
// 2,4
// 1,5
// 0,6
// 3,3
// 2,6
// 5,1
// 1,2
// 5,5
// 2,5
// 6,5
// 1,4
// 0,4
// 6,4
// 1,1
// 6,1
// 1,0
// 0,5
// 1,6
// 2,0
// Each byte position is given as an X,Y coordinate, where X is the distance from the left edge of your memory space and Y is the distance from the top edge of your memory space.

// You and The Historians are currently in the top left corner of the memory space (at 0,0) and need to reach the exit in the bottom right corner (at 70,70 in your memory space, but at 6,6 in this example). You'll need to simulate the falling bytes to plan out where it will be safe to run; for now, simulate just the first few bytes falling into your memory space.

// As bytes fall into your memory space, they make that coordinate corrupted. Corrupted memory coordinates cannot be entered by you or The Historians, so you'll need to plan your route carefully. You also cannot leave the boundaries of the memory space; your only hope is to reach the exit.

// In the above example, if you were to draw the memory space after the first 12 bytes have fallen (using . for safe and # for corrupted), it would look like this:

// ...#...
// ..#..#.
// ....#..
// ...#..#
// ..#..#.
// .#..#..
// #.#....
// You can take steps up, down, left, or right. After just 12 bytes have corrupted locations in your memory space, the shortest path from the top left corner to the exit would take 22 steps. Here (marked with O) is one such path:

// OO.#OOO
// .O#OO#O
// .OOO#OO
// ...#OO#
// ..#OO#.
// .#.O#..
// #.#OOOO
// Simulate the first kilobyte (1024 bytes) falling onto your memory space. Afterward, what is the minimum number of steps needed to reach the exit?

import fullData from '../assets/inputs/D18-input.txt?raw';
import sampleData from '../assets/inputs/D18-sample.txt?raw';
import { DIRECTIONS } from '../utils/arrayHelpers';
import formatDuration from '../utils/formatDuration';
import { PriorityQueue } from '../utils/priorityQueue';

type Point = [column: number, row: number];

function parseData(data: string, bytesToRead: number): Map<string, Point> {
  const coordMap = new Map<string, Point>();

  data
    .trim()
    .split('\n')
    .slice(0, bytesToRead)
    .forEach((line) => {
      const [x, y] = line.split(',').map(Number);
      // Store both the string version (for lookup) and numeric tuple (for calculations)
      coordMap.set(`${x},${y}`, [x, y]);
    });

  return coordMap;
}

function parseDataPartTwo(data: string): Map<string, Point> {
  const coordMap = new Map<string, Point>();

  data
    .trim()
    .split('\n')
    .forEach((line) => {
      const [x, y] = line.split(',').map(Number);
      // Store both the string version (for lookup) and numeric tuple (for calculations)
      coordMap.set(`${x},${y}`, [x, y]);
    });

  return coordMap;
}

function D18P1(data: Map<string, Point>, gridSize: number): { result: number; timing: number } {
  const start = performance.now();

  const dist = new Map<string, number>();
  const queue = new PriorityQueue<{ cost: number; point: Point }>((element) => element.cost);

  dist.set('0,0', 0);
  queue.push({ cost: 0, point: [0, 0] });

  while (queue.size > 0) {
    const next = queue.pop();
    if (!next) continue;

    const { cost: currentCost, point: currentPoint } = next;
    const pointKey = `${currentPoint[0]},${currentPoint[1]}`;
    console.log(`${pointKey} - ${currentCost}`);

    // If we have already found a better route to this point, skip
    if (currentCost > (dist.get(pointKey) ?? Infinity)) continue;

    // If we've reached the exit, return the cost
    if (currentPoint[0] === gridSize && currentPoint[1] === gridSize) {
      return { timing: performance.now() - start, result: currentCost };
    }

    for (const [dx, dy] of DIRECTIONS) {
      const [col, row] = currentPoint;
      const [newCol, newRow] = [col + dx, row + dy];
      if (newCol < 0 || newCol > gridSize || newRow < 0 || newRow > gridSize) continue;

      const newPointKey = `${newCol},${newRow}`;
      // Skip corrupted locations
      if (data.has(newPointKey)) continue;

      const newCost = currentCost + 1;
      const oldCost = dist.get(newPointKey) ?? Infinity;
      if (newCost < oldCost) {
        dist.set(newPointKey, newCost);
        queue.push({ cost: newCost, point: [newCol, newRow] });
      }
    }
  }

  const timing = performance.now() - start;
  return { timing, result: -1 };
}

function D18P2(data: Map<string, Point>, gridSize: number): { result: string; timing: number } {
  const start = performance.now();

  // Binary search for the number of bytes to read such that the path is passable
  let left = 0;
  let right = Array.from(data.entries()).length;
  let bytesToRead = Math.floor((left + right) / 2);

  while (left <= right) {
    console.log(`${left} - ${right} - ${bytesToRead}`);
    const slicedData = new Map(Array.from(data.entries()).slice(0, bytesToRead));
    const { result } = D18P1(slicedData, gridSize);

    if (result === -1) {
      console.log('impassable');
      // If impassable, try a smaller slice
      right = bytesToRead - 1;
    } else {
      console.log('passable');
      // If passable, try a bigger slice
      left = bytesToRead + 1;
    }

    bytesToRead = Math.floor((left + right) / 2);
  }

  const slicedData = new Map(Array.from(data.entries()).slice(0, bytesToRead + 1));
  const result = Array.from(slicedData.values())[bytesToRead];
  const timing = performance.now() - start;
  return { timing, result: `${result[0]},${result[1]}` };
}

export default function DX({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const bytesToRead = inputType === 'sample' ? 12 : 1024;
  const maxGridRowCol = inputType === 'sample' ? 6 : 70;
  const data = parseData(rawData, bytesToRead);
  const dataPartTwo = parseDataPartTwo(rawData);
  const response1 = D18P1(data, maxGridRowCol);
  const response2 = D18P2(dataPartTwo, maxGridRowCol);

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
