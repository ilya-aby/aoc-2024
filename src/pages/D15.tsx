import fullData from '../assets/inputs/D15-input.txt?raw';
import sampleData from '../assets/inputs/D15-sample.txt?raw';
import { AnimatedGridViz } from '../utils/AnimatedGridViz';
import formatDuration from '../utils/formatDuration';
import { GridViz } from '../utils/GridViz';

type Map = string[][];
type Moves = string[];

function parseData(data: string): { map: Map; moves: Moves } {
  const [map, moves] = data.trim().split('\n\n');
  return {
    map: map.split('\n').map((line) => line.split('')),
    moves: moves.split('').filter((char) => ['<', '>', '^', 'v'].includes(char)),
  };
}

function dirStringToVector(dirString: string): [number, number] {
  switch (dirString) {
    case '>':
      return [0, 1];
    case '<':
      return [0, -1];
    case 'v':
      return [1, 0];
    case '^':
      return [-1, 0];
    default:
      throw new Error(`Invalid direction: ${dirString}`);
  }
}

function getMapGPSSum(map: Map): number {
  let sum = 0;

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      if (map[row][col] === 'O') {
        sum += 100 * row + col;
      }
    }
  }
  return sum;
}

function D15P1(data: { map: Map; moves: Moves }): { result: number; timing: number; map: Map } {
  const start = performance.now();

  // Create deep copy of the map
  const map = JSON.parse(JSON.stringify(data.map));

  // Locate the robot row and column
  let robotRow = map.findIndex((row: string[]) => row.includes('@'));
  let robotCol = map[robotRow].indexOf('@');

  // Apply the moves to the robot
  for (const move of data.moves) {
    const [rowVec, colVec] = dirStringToVector(move);
    const newRow = robotRow + rowVec;
    const newCol = robotCol + colVec;

    // If the robot would move into a wall, skip the move
    if (map[newRow][newCol] === '#') {
      continue;
    }

    // Check if there's at least one empty space in the direction the robot is moving
    let hasEmptySpace = false;
    let checkRow = newRow;
    let checkCol = newCol;
    let emptySpaceRow = -1;
    let emptySpaceCol = -1;
    while (map[checkRow][checkCol] !== '#') {
      if (map[checkRow][checkCol] === '.') {
        hasEmptySpace = true;
        emptySpaceRow = checkRow;
        emptySpaceCol = checkCol;
        break;
      }
      checkRow += rowVec;
      checkCol += colVec;
    }
    // If there's no empty space, the robot can't move
    if (!hasEmptySpace) {
      continue;
    }

    // Robot will move out of its current position no matter what
    map[robotRow][robotCol] = '.';
    map[newRow][newCol] = '@';
    robotCol += colVec;
    robotRow += rowVec;

    // We must be moving a box or stack of boxes into empty space
    // Can shortcut this but just putting a box in the empty space - it will be replaced by robot
    if (newRow !== emptySpaceRow || newCol !== emptySpaceCol) {
      map[emptySpaceRow][emptySpaceCol] = 'O';
    }
  }

  const result = getMapGPSSum(map);
  const timing = performance.now() - start;
  return { timing, result, map };
}

function widenMap(map: Map): Map {
  return map.map((row) => {
    const newRow: string[] = [];
    for (const cell of row) {
      switch (cell) {
        case '#':
          newRow.push('#', '#');
          break;
        case 'O':
          newRow.push('[', ']');
          break;
        case '.':
          newRow.push('.', '.');
          break;
        case '@':
          newRow.push('@', '.');
          break;
        default:
          throw new Error(`Unknown cell type: ${cell}`);
      }
    }
    return newRow;
  });
}

function getWideMapGPSSum(map: Map): number {
  let sum = 0;

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      if (map[row][col] === '[') {
        sum += 100 * row + col;
      }
    }
  }
  return sum;
}

function D15P2(data: { map: Map; moves: Moves }): {
  result: number;
  timing: number;
  map: Map;
  frames: Map[];
} {
  const start = performance.now();
  const frames: Map[] = [];

  // Create deep copy of the double-width map
  const map = JSON.parse(JSON.stringify(widenMap(data.map)));

  // Locate the robot row and column
  let robotRow = map.findIndex((row: string[]) => row.includes('@'));
  let robotCol = map[robotRow].indexOf('@');

  // Apply the moves to the robot
  for (const move of data.moves) {
    frames.push(JSON.parse(JSON.stringify(map)));
    const [rowVec, colVec] = dirStringToVector(move);
    const newRow = robotRow + rowVec;
    const newCol = robotCol + colVec;

    // If the robot would move into a wall, skip the move
    if (map[newRow][newCol] === '#') {
      continue;
    }

    // If robot is moving into empty space, we can just move it there
    if (map[newRow][newCol] === '.') {
      map[robotRow][robotCol] = '.';
      map[newRow][newCol] = '@';
      robotCol += colVec;
      robotRow += rowVec;
      continue;
    }

    // If we're moving within the same row, we have less complex logic since there won't be any
    // pyramidal chains of boxes to consider - just a flat row moving left or right
    if (newRow === robotRow) {
      // Check if there's at least one empty space in the direction the robot is moving
      let hasEmptySpace = false;
      let checkCol = newCol;
      let emptySpaceCol = -1;
      while (map[robotRow][checkCol] !== '#') {
        if (map[robotRow][checkCol] === '.') {
          hasEmptySpace = true;
          emptySpaceCol = checkCol;
          break;
        }
        checkCol += colVec;
      }
      // If there's no empty space, the robot can't move laterally
      if (!hasEmptySpace) {
        continue;
      }

      // We have to move a chain of [] boxes into the empty space
      // Scan from our current position to the empty space and move all the boxes
      checkCol = emptySpaceCol;
      let nextCol = checkCol;
      while (checkCol !== robotCol) {
        nextCol -= colVec;
        if (map[robotRow][nextCol] === '[' || map[robotRow][nextCol] === ']') {
          map[robotRow][checkCol] = map[robotRow][nextCol];
        }
        checkCol = nextCol;
      }

      // Robot will move out of its current column
      map[robotRow][robotCol] = '.';
      map[newRow][newCol] = '@';
      robotCol += colVec;
      robotRow += rowVec;
    } else {
      // If robot is moving into a different row, we have to handle the pyramidal chains of boxes
      //
      // Key insight: to move a box, we have to discover the chain of all connected pyramidal boxes
      // The box chain can only move if the row above the chain is completely empty
      // So we need to find the chain of boxes, then check if the row above is empty, then move the chain
      // Then we need to update the map to reflect the new position of the robot and the boxes

      const boxChain: [[number, number], [number, number]][] = [];

      // Get the initial box the robot is moving
      if (map[newRow][newCol] === '[') {
        boxChain.push([
          [newRow, newCol],
          [newRow, newCol + 1],
        ]);
      } else if (map[newRow][newCol] === ']') {
        boxChain.push([
          [newRow, newCol - 1],
          [newRow, newCol],
        ]);
      }

      // Run a mini-DFS to find the entire chain of boxes
      const queue: [[number, number], [number, number]][] = [...boxChain];
      let boxChainStuck = false;
      while (queue.length > 0) {
        const [[boxRow, leftCol], [, rightCol]] = queue.shift()!;
        const checkRow = boxRow + rowVec;

        if (map[checkRow][leftCol] === '#' || map[checkRow][rightCol] === '#') {
          boxChainStuck = true;
          break;
        }

        // If the left edge has a left edge above it, there's a direct neighbor above
        // []
        // []
        if (map[checkRow][leftCol] === '[') {
          queue.push([
            [checkRow, leftCol],
            [checkRow, leftCol + 1],
          ]);
          boxChain.push([
            [checkRow, leftCol],
            [checkRow, leftCol + 1],
          ]);
        } else if (map[checkRow][leftCol] === ']') {
          // If the left edge has a right edge above it, there's a diagonal neighbor above
          // []
          //  []
          queue.push([
            [checkRow, leftCol - 1],
            [checkRow, leftCol],
          ]);
          boxChain.push([
            [checkRow, leftCol - 1],
            [checkRow, leftCol],
          ]);
        }
        if (map[checkRow][rightCol] === '[') {
          // If the right edge has a left edge above it, there's a diagonal neighbor above
          //  []
          // []
          queue.push([
            [checkRow, rightCol],
            [checkRow, rightCol + 1],
          ]);
          boxChain.push([
            [checkRow, rightCol],
            [checkRow, rightCol + 1],
          ]);
        }
      }
      // If the box chain is stuck, we can't move it and robot can't move
      if (boxChainStuck) {
        continue;
      }

      // First, clear all the old box positions
      for (const [[boxRow, leftCol], [, rightCol]] of boxChain) {
        map[boxRow][leftCol] = '.';
        map[boxRow][rightCol] = '.';
      }

      // Then place all the new boxes
      for (const [[boxRow, leftCol], [, rightCol]] of boxChain) {
        map[boxRow + rowVec][leftCol] = '[';
        map[boxRow + rowVec][rightCol] = ']';
      }

      // Robot will move out of its current position
      map[robotRow][robotCol] = '.';
      map[newRow][newCol] = '@';
      robotCol += colVec;
      robotRow += rowVec;
    }
  }

  const result = getWideMapGPSSum(map);
  const timing = performance.now() - start;
  return { timing, result, map, frames };
}

export default function D15({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const data = parseData(rawData);
  const response1 = D15P1(data);
  const response2 = D15P2(data);

  return (
    <>
      <p>
        Part 1: <span className='font-mono text-lime-500'>{response1.result}</span>
      </p>
      <p className='font-mono text-gray-500'>⏱️ {formatDuration(response1.timing)}</p>
      <GridViz grid={response1.map} />
      <p>
        Part 2: <span className='font-mono text-lime-500'>{response2.result}</span>
      </p>
      <p className='font-mono text-gray-500'>⏱️ {formatDuration(response2.timing)}</p>
      <AnimatedGridViz frames={response2.frames} speed={10} framesPerRender={5} />
    </>
  );
}
