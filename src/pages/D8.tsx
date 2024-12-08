import fullData from '../assets/inputs/D8-input.txt?raw';
import sampleData from '../assets/inputs/D8-sample.txt?raw';
import { GridViz } from '../utils/GridViz';

function parseData(data: string): string[][] {
  return data
    .trim()
    .split('\n')
    .map((line) => line.split(''));
}

type Coord = [number, number];
type FreqMap = [string, Coord[]];

function getGCD(a: number, b: number): number {
  return b === 0 ? a : getGCD(b, a % b);
}

function getCoordinateMap(data: string[][]): FreqMap[] {
  const frequencies: FreqMap[] = [];

  // Collect all coordinates for each frequency
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      const char = data[y][x];
      if (char === '.') continue;

      const existing = frequencies.find(([freq]) => freq === char);
      if (existing) {
        existing[1].push([y, x]);
      } else {
        frequencies.push([char, [[y, x]]]);
      }
    }
  }
  return frequencies;
}

function D8P1(data: string[][]): { count: number; vizGrid: string[][] } {
  const frequencies = getCoordinateMap(data);
  const antinodeSet = new Set<string>();

  frequencies.forEach(([, coords]) => {
    for (let i = 0; i < coords.length; i++) {
      for (let j = i + 1; j < coords.length; j++) {
        const [y1, x1] = coords[i];
        const [y2, x2] = coords[j];

        // Get raw directional differences
        const dy = y1 - y2;
        const dx = x1 - x2;

        // Calculate two antinodes:
        // 1. Point that makes first antenna twice as far as second
        // 2. Point that makes second antenna twice as far as first
        const antinodePoints: Coord[] = [
          [y1 + dy, x1 + dx],
          [y2 - dy, x2 - dx],
        ];

        // Add antinodes if they're within bounds
        antinodePoints.forEach(([y, x]) => {
          if (y >= 0 && y < data.length && x >= 0 && x < data[0].length) {
            antinodeSet.add(`${y},${x}`);
          }
        });
      }
    }
  });
  // Create a copy of the grid for visualization
  const vizGrid = data.map((row) => [...row]);
  Array.from(antinodeSet).forEach((coord) => {
    const [y, x] = coord.split(',').map(Number);
    vizGrid[y][x] = vizGrid[y][x] === '.' ? '#' : vizGrid[y][x];
  });

  // Return both the count and the visualization grid
  return { count: antinodeSet.size, vizGrid };
}

function D8P2(data: string[][]): { count: number; vizGrid: string[][] } {
  const frequencies = getCoordinateMap(data);

  console.log('Frequencies:', frequencies);

  const antinodeSet = new Set<string>();

  frequencies.forEach(([, coords]) => {
    for (let i = 0; i < coords.length; i++) {
      for (let j = i + 1; j < coords.length; j++) {
        const [y1, x1] = coords[i];
        const [y2, x2] = coords[j];

        // Get raw directional differences
        const dy = y1 - y2;
        const dx = x1 - x2;

        // Calculate GCD to get smallest integer slope
        const gcd = Math.abs(getGCD(dy, dx));
        const unitDy = dy / gcd;
        const unitDx = dx / gcd;

        console.log(`Unit slope: ${unitDy}/${unitDx}`);

        let step = 0;

        while (true) {
          const antinodePoint = [y1 + unitDy * step, x1 + unitDx * step];
          if (
            antinodePoint[0] >= 0 &&
            antinodePoint[0] < data.length &&
            antinodePoint[1] >= 0 &&
            antinodePoint[1] < data[0].length
          ) {
            antinodeSet.add(`${antinodePoint[0]},${antinodePoint[1]}`);
          } else {
            break;
          }
          step++;
        }

        step = 0;

        while (true) {
          const antinodePoint = [y2 - unitDy * step, x2 - unitDx * step];
          if (
            antinodePoint[0] >= 0 &&
            antinodePoint[0] < data.length &&
            antinodePoint[1] >= 0 &&
            antinodePoint[1] < data[0].length
          ) {
            antinodeSet.add(`${antinodePoint[0]},${antinodePoint[1]}`);
          } else {
            break;
          }
          step++;
        }
      }
    }
  });
  // Create a copy of the grid for visualization
  const vizGrid = data.map((row) => [...row]);
  Array.from(antinodeSet).forEach((coord) => {
    const [y, x] = coord.split(',').map(Number);
    vizGrid[y][x] = vizGrid[y][x] === '.' ? '#' : vizGrid[y][x];
  });

  // Return both the count and the visualization grid
  return { count: antinodeSet.size, vizGrid };
}

export default function D8({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const data = parseData(rawData);

  return (
    <>
      <p>
        Part 1: <span className='font-mono text-lime-500'>{D8P1(data).count}</span>
      </p>
      <GridViz grid={D8P1(data).vizGrid} showAxes />
      <p className='mt-4'>
        Part 2: <span className='font-mono text-lime-500'>{D8P2(data).count}</span>
      </p>
      <GridViz grid={D8P2(data).vizGrid} showAxes />
    </>
  );
}
