import fullData from '../assets/inputs/D16-input.txt?raw';
import sampleData from '../assets/inputs/D16-sample.txt?raw';
import formatDuration from '../utils/formatDuration';

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

function rotateHeading([dr, dc]: Point, direction: 1 | -1): Point {
  // 1 for clockwise, -1 for counter-clockwise
  return direction === 1 ? [-dc, dr] : [dc, -dr];
}

function D16P1(data: { map: Map; start: Point; end: Point }): { result: number; timing: number } {
  const start = performance.now();

  let minCostSeen = Infinity;
  const queue: { point: Point; cost: number; heading: Point }[] = [];

  // Keep track of visited states (position + heading)
  const visited = new Map<string, number>();

  // Start facing east at the start point
  queue.push({ point: data.start, cost: 0, heading: [0, 1] });

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    const { point, cost, heading } = current;

    const [row, col] = point;
    const [dr, dc] = heading;

    // Create a unique key for this state
    const stateKey = `${row},${col},${dr},${dc}`;

    // If we've seen this state with a lower cost, skip it
    const previousCost = visited.get(stateKey);
    if (previousCost !== undefined && previousCost <= cost) continue;
    visited.set(stateKey, cost);

    // If we've already seen a lower cost, terminate early
    if (cost > minCostSeen) continue;

    // Try moving forward 1 tile
    const newRow = row + dr;
    const newCol = col + dc;
    if (
      newRow >= 0 &&
      newRow < data.map.length &&
      newCol >= 0 &&
      newCol < data.map[0].length &&
      data.map[newRow][newCol] !== '#'
    ) {
      const newChar = data.map[newRow][newCol];

      // If we've reached the end, update the minimum cost
      if (newChar === 'E') {
        minCostSeen = Math.min(minCostSeen, cost + 1);
        continue;
      }

      queue.push({ point: [newRow, newCol], cost: cost + 1, heading });
    }

    // Option 2: Rotate 90 degrees clockwise, pay 1000 points
    const newHeading = rotateHeading(heading, 1);
    queue.push({ point, cost: cost + 1000, heading: newHeading });

    // Option 3: Rotate 90 degrees counter-clockwise, pay 1000 points
    const newHeading2 = rotateHeading(heading, -1);
    queue.push({ point, cost: cost + 1000, heading: newHeading2 });
  }

  const timing = performance.now() - start;
  return { timing, result: minCostSeen };
}

function D16P2(data: { map: Map; start: Point; end: Point }): { result: number; timing: number } {
  const start = performance.now();

  let minCostSeen = Infinity;
  const bestPaths = new Map<number, Point[][]>();
  const queue: { point: Point; cost: number; heading: Point; path: Point[] }[] = [];

  // Keep track of visited states (position + heading + cost)
  const visited = new Map<string, number>();

  // Start facing east at the start point
  queue.push({ point: data.start, cost: 0, heading: [0, 1], path: [data.start] });

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    const { point, cost, heading, path } = current;

    if (cost >= minCostSeen) continue;

    const [row, col] = point;
    const [dr, dc] = heading;

    // Create a unique key for this state (excluding cost)
    const stateKey = `${row},${col},${dr},${dc}`;

    // If we've seen this state with a lower cost, skip it
    const previousCost = visited.get(stateKey);
    if (previousCost !== undefined && previousCost < cost) continue;
    visited.set(stateKey, cost);

    // Try moving forward 1 tile
    const newRow = row + dr;
    const newCol = col + dc;
    if (
      newRow >= 0 &&
      newRow < data.map.length &&
      newCol >= 0 &&
      newCol < data.map[0].length &&
      data.map[newRow][newCol] !== '#'
    ) {
      const newChar = data.map[newRow][newCol];
      const newPoint: Point = [newRow, newCol];

      // If we've reached the end, update the minimum cost and store the path
      if (newChar === 'E') {
        const finalCost = cost + 1;
        if (finalCost <= minCostSeen) {
          minCostSeen = finalCost;
          const finalPath = [...path, newPoint];

          // Store the path
          if (!bestPaths.has(finalCost)) {
            bestPaths.set(finalCost, []);
          }
          bestPaths.get(finalCost)?.push(finalPath);
        }
        continue;
      }

      queue.push({
        point: newPoint,
        cost: cost + 1,
        heading,
        path: [...path, newPoint],
      });
    }

    // Option 2: Rotate 90 degrees clockwise, pay 1000 points
    const newHeading = rotateHeading(heading, 1);
    queue.push({ point, cost: cost + 1000, heading: newHeading, path: [...path] });

    // Option 3: Rotate 90 degrees counter-clockwise, pay 1000 points
    const newHeading2 = rotateHeading(heading, -1);
    queue.push({ point, cost: cost + 1000, heading: newHeading2, path: [...path] });
  }

  // Now bestPaths.get(minCostSeen) will give you all paths with the minimum cost
  const optimalPaths = bestPaths.get(minCostSeen) || [];

  // Count unique tiles used in any optimal path
  const uniqueTiles = new Set<string>();
  optimalPaths.forEach((path) => {
    path.forEach(([row, col]) => {
      uniqueTiles.add(`${row},${col}`);
    });
  });

  console.log(uniqueTiles);
  // Print the map with paths marked
  console.log('\nPath visualization:');
  for (let row = 0; row < data.map.length; row++) {
    let line = '';
    for (let col = 0; col < data.map[row].length; col++) {
      if (uniqueTiles.has(`${row},${col}`)) {
        line += 'O';
      } else {
        line += data.map[row][col];
      }
    }
    console.log(line);
  }

  const timing = performance.now() - start;
  return { timing, result: uniqueTiles.size };
}

export default function D16({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const data = parseData(rawData);
  const response1 = D16P1(data);
  const response2 = D16P2(data);

  return (
    <>
      <p>
        Part 1: <span className='font-mono text-lime-500'>{response1.result}</span>
      </p>
      <p className='font-mono text-gray-500'>⏱️ {formatDuration(response1.timing)}</p>
      <p>
        Part 2: <span className='font-mono text-lime-500'>{response2.result}</span>
      </p>
      <p className='font-mono text-gray-500'>⏱️ {formatDuration(response2.timing)}</p>
    </>
  );
}
