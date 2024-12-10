import fullData from '../assets/inputs/D10-input.txt?raw';
import sampleData from '../assets/inputs/D10-sample.txt?raw';
import { GridViz } from '../utils/GridViz';

type ElevationValue = number | '.';
type ElevationMap = ElevationValue[][];
type ElevationPoint = { row: number; col: number; elevation: ElevationValue };
type Trailhead = { row: number; col: number; trailScore: number };

function parseData(data: string): ElevationMap {
  return data
    .trim()
    .split('\n')
    .map((line) => line.split('').map((char) => (char === '.' ? '.' : parseInt(char))));
}

function D10PX(data: ElevationMap, allowRevisit: boolean): number {
  const peaks: ElevationPoint[] = [];
  const trailheads: Trailhead[] = [];

  // Find all peaks (9s) and trailheads (0s)
  for (let row = 0; row < data.length; row++) {
    for (let col = 0; col < data[row].length; col++) {
      const elevation = data[row][col];
      if (elevation === 9) {
        peaks.push({ row, col, elevation });
      } else if (elevation === 0) {
        trailheads.push({ row, col, trailScore: 0 });
      }
    }
  }

  console.log('Peaks:', peaks);
  console.log('Trailheads:', trailheads);

  // Process each peak separately since we need to keep track of visited points
  // on a per-peak basis
  for (const peak of peaks) {
    const queue: ElevationPoint[] = [peak];
    const visited = new Set<string>();
    visited.add(`${peak.row},${peak.col}`);

    while (queue.length > 0) {
      console.log('Queue:', queue);
      const current = queue.shift();
      if (!current || current.elevation === '.') continue;

      // Get valid adjacent coordinates (up, down, left, right)
      const directions = [
        { dx: -1, dy: 0 }, // left
        { dx: 1, dy: 0 }, // right
        { dx: 0, dy: -1 }, // up
        { dx: 0, dy: 1 }, // down
      ].filter(({ dx, dy }) => {
        const newRow = current.row + dy;
        const newCol = current.col + dx;

        // Check bounds
        return (
          newRow >= 0 &&
          newRow < data.length &&
          newCol >= 0 &&
          newCol < data[0].length &&
          // Check that the adjacent cell is not a '.'
          data[newRow][newCol] !== '.' &&
          // Check that the adjacent cell is a valid elevation and a smooth descent
          (data[newRow][newCol] as number) === (current.elevation as number) - 1
        );
      });

      for (const direction of directions) {
        const newRow = current.row + direction.dy;
        const newCol = current.col + direction.dx;
        const newElev = data[newRow][newCol];
        const coordKey = `${newRow},${newCol}`;

        if (!allowRevisit && visited.has(coordKey)) {
          continue;
        }
        visited.add(coordKey);

        if (newElev === 0) {
          // We've found a trailhead. Find it in our trailheads array and increment its trailScore
          const trailhead = trailheads.find((th) => th.row === newRow && th.col === newCol);
          if (trailhead) {
            trailhead.trailScore++;
          }
          continue;
        }

        // Otherwise, add the new point to the queue
        queue.push({ row: newRow, col: newCol, elevation: newElev });
      }
    }
  }
  console.log('Trailheads:', trailheads);
  // Return the sum of all trailhead scores
  return trailheads.reduce((sum, th) => sum + th.trailScore, 0);
}

export default function D10({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const data = parseData(rawData);

  return (
    <>
      <p>
        Part 1: <span className='font-mono text-lime-500'>{D10PX(data, false)}</span>
      </p>
      <GridViz grid={data} showAxes={true} className='mt-4' />
      <p className='mt-4'>
        Part 2: <span className='font-mono text-lime-500'>{D10PX(data, true)}</span>
      </p>
      <GridViz grid={data} showAxes={true} className='mt-4' />
    </>
  );
}
