import fullData from '../assets/inputs/D20-input.txt?raw';
import sampleData from '../assets/inputs/D20-sample.txt?raw';
import formatDuration from '../utils/formatDuration';
import { GridViz } from '../utils/GridViz';

type Map = string[][];
type Point = [row: number, col: number];

function parseData(data: string): { map: Map; start: Point; end: Point } {
  const map = data
    .trim()
    .split('\n')
    .map((line) => line.split(''));

  // Find start coordinates
  const startRow = map.findIndex((row) => row.includes('S'));
  const startCol = map[startRow].indexOf('S');
  const start: Point = [startRow, startCol];

  // Find end coordinates
  const endRow = map.findIndex((row) => row.includes('E'));
  const endCol = map[endRow].indexOf('E');
  const end: Point = [endRow, endCol];

  return { map, start, end };
}

function computeShortestDistances(map: Map, start: Point): number[][] {
  const rows = map.length;
  const cols = map[0].length;
  const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const queue: Point[] = [];

  dist[start[0]][start[1]] = 0;
  queue.push(start);

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const currentDist = dist[r][c];

    for (const [dr, dc] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

      // Only move onto track cells (including S, E, and .)
      if (map[nr][nc] !== '#' && dist[nr][nc] > currentDist + 1) {
        dist[nr][nc] = currentDist + 1;
        queue.push([nr, nc]);
      }
    }
  }

  return dist;
}

function D20P1(data: { map: Map; start: Point; end: Point }): {
  result: number;
  timing: number;
  visualMap: Map;
} {
  const start = performance.now();

  const timeSavingsThreshhold = 100;
  let numGreatCheats = 0;
  const distances = computeShortestDistances(data.map, data.start);

  // Convert distances array to string representation
  const visualMap: string[][] = distances.map((row) =>
    row.map((cell) => (cell === Infinity ? '##' : cell.toString().padStart(2, '0'))),
  );

  // Loop through all cells except the outer rim
  for (let r = 1; r < distances.length - 1; r++) {
    for (let c = 1; c < distances[0].length - 1; c++) {
      // Only check wall cells
      if (data.map[r][c] === '#') {
        // Check horizontal neighbors (left/right)
        const leftDist = distances[r][c - 1];
        const rightDist = distances[r][c + 1];
        if (leftDist !== Infinity && rightDist !== Infinity) {
          const savings = Math.max(leftDist, rightDist) - (Math.min(leftDist, rightDist) + 2);
          if (savings >= timeSavingsThreshhold) {
            console.log(`Horizontal wall jump at (${r},${c}) saves ${savings} steps`);
            numGreatCheats++;
          }
        }

        // Check vertical neighbors (top/bottom)
        const topDist = distances[r - 1][c];
        const bottomDist = distances[r + 1][c];
        if (topDist !== Infinity && bottomDist !== Infinity) {
          const savings = Math.max(topDist, bottomDist) - (Math.min(topDist, bottomDist) + 2);
          if (savings >= timeSavingsThreshhold) {
            console.log(`Vertical wall jump at (${r},${c}) saves ${savings} steps`);
            numGreatCheats++;
          }
        }
      }
    }
  }

  const result = numGreatCheats;
  return { timing: performance.now() - start, result, visualMap };
}

function D20P2(data: { map: Map; start: Point; end: Point }): {
  result: number;
  timing: number;
} {
  const start = performance.now();

  const timeSavingsThreshhold = 100;
  let numGreatCheats = 0;
  const distances = computeShortestDistances(data.map, data.start);

  // Loop through all cells except the outer rim
  for (let r = 1; r < distances.length - 1; r++) {
    for (let c = 1; c < distances[0].length - 1; c++) {
      // Only check valid path cells
      if (data.map[r][c] !== '#') {
        // Check all cells within manhattan distance 20
        for (let dr = -20; dr <= 20; dr++) {
          for (let dc = -20; dc <= 20; dc++) {
            const manhattanDist = Math.abs(dr) + Math.abs(dc);
            // Skip if manhattan distance > 20
            if (manhattanDist > 20) continue;

            // Skip the cell itself
            if (dr === 0 && dc === 0) continue;

            const nr = r + dr;
            const nc = c + dc;

            // Skip if out of bounds
            if (nr < 0 || nr >= distances.length || nc < 0 || nc >= distances[0].length) continue;

            const startDist = distances[r][c];
            const endDist = distances[nr][nc];

            // Skip if either point is unreachable
            if (startDist === Infinity || endDist === Infinity) continue;

            const actualDelta = endDist - startDist;
            const savings = actualDelta - manhattanDist;

            if (savings >= timeSavingsThreshhold) {
              numGreatCheats++;
            }
          }
        }
      }
    }
  }

  return { timing: performance.now() - start, result: numGreatCheats };
}

export default function D20({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const data = parseData(rawData);
  const response1 = D20P1(data);
  const response2 = D20P2(data);

  return (
    <>
      <p>
        Part 1: <span className='font-mono text-lime-500'>{response1.result}</span>
      </p>
      <p className='font-mono text-gray-500'>⏱️ {formatDuration(response1.timing)}</p>
      <GridViz grid={response1.visualMap} />
      <p className='mt-4'>
        Part 2: <span className='font-mono text-lime-500'>{response2.result}</span>
      </p>
      <p className='font-mono text-gray-500'>⏱️ {formatDuration(response2.timing)}</p>
    </>
  );
}
