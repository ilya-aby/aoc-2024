import fullData from '../assets/inputs/D12-input.txt?raw';
import sampleData from '../assets/inputs/D12-sample.txt?raw';
import formatDuration from '../utils/formatDuration';
import { GridViz } from '../utils/GridViz';

function parseData(data: string): string[][] {
  return data
    .trim()
    .split('\n')
    .map((line) => line.split(''));
}

function countPolygonEdges(data: string[][], row: number, col: number): number {
  const letter = data[row][col];
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  // Helper to safely check cell value
  const getCell = (r: number, c: number) =>
    r >= 0 && r < data.length && c >= 0 && c < data[0].length ? data[r][c] : null;

  return directions
    .map((_, i) => {
      // Get the two adjacent directions for this corner
      const d1 = directions[i];
      const d2 = directions[(i + 1) % 4];

      return [
        letter, // current cell
        getCell(row + d1[0], col + d1[1]), // left neighbor
        getCell(row + d2[0], col + d2[1]), // right neighbor
        getCell(row + d1[0] + d2[0], col + d1[1] + d2[1]), // diagonal
      ];
    })
    .filter(
      ([current, left, right, diagonal]) =>
        (left !== current && right !== current) || // external corner
        (left === current && right === current && diagonal !== current), // internal corner
    ).length;
}

function D12P1(data: string[][]): { part1: number; part2: number; timing: number } {
  const start = performance.now();

  // Create visited array
  const visited = Array(data.length)
    .fill(null)
    .map(() => Array(data[0].length).fill(false));

  // Track all area/perimeter pairs we find
  const regions: Array<{ letter: string; area: number; perimeter: number; sides: number }> = [];

  // Define directions for BFS and boundary walk
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  // Helper to check if a position is valid and matches the target letter
  const isValid = (row: number, col: number, target: string) => {
    return (
      row >= 0 && row < data.length && col >= 0 && col < data[0].length && data[row][col] === target
    );
  };

  // Process until all squares are visited
  while (visited.some((row) => row.some((cell) => !cell))) {
    // Find first unvisited square
    let startRow = 0,
      startCol = 0;
    outer: for (let r = 0; r < data.length; r++) {
      for (let c = 0; c < data[0].length; c++) {
        if (!visited[r][c]) {
          startRow = r;
          startCol = c;
          break outer;
        }
      }
    }

    // BFS from this square
    const stack = [[startRow, startCol]];
    const targetLetter = data[startRow][startCol];
    let area = 0;
    let perimeter = 0;
    let sides = 0;
    while (stack.length > 0) {
      const [row, col] = stack.pop()!;

      // Skip if already visited
      if (visited[row][col]) continue;

      // Mark as visited and increment area
      visited[row][col] = true;
      area++;

      sides += countPolygonEdges(data, row, col);

      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        if (isValid(newRow, newCol, targetLetter)) {
          // Same letter - add to stack if not visited
          if (!visited[newRow][newCol]) {
            stack.push([newRow, newCol]);
          }
        } else {
          // Different letter or edge - increment perimeter
          perimeter++;
        }
      }
    }

    regions.push({ letter: targetLetter, area, perimeter, sides });
  }

  console.log('Regions found:', regions);

  const part1cost = regions.reduce((sum, region) => sum + region.area * region.perimeter, 0);
  const part2cost = regions.reduce((sum, region) => sum + region.area * region.sides, 0);
  const timing = performance.now() - start;
  return { part1: part1cost, part2: part2cost, timing };
}

export default function DX({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const data = parseData(rawData);
  const response1 = D12P1(data);

  return (
    <>
      <p>
        Part 1: <span className='font-mono text-lime-500'>{response1.part1}</span>
      </p>
      <p className='font-mono text-gray-500'>⏱️ {formatDuration(response1.timing)}</p>
      <GridViz grid={data} showAxes className='mt-4' />
      <p className='mt-4'>
        Part 2: <span className='font-mono text-lime-500'>{response1.part2}</span>
      </p>
      <p className='font-mono text-gray-500'>⏱️ {formatDuration(response1.timing)}</p>
    </>
  );
}
