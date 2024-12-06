import fullData from '../assets/inputs/D6-input.txt?raw';
import sampleData from '../assets/inputs/D6-sample.txt?raw';
import { GridViz } from '../utils/GridViz';
type Guard = {
  startRow: number;
  startCol: number;
  row: number;
  col: number;
  dx: number;
  dy: number;
};

type Direction = {
  dx: number;
  dy: number;
};

type VisitedCell = {
  visited: boolean;
  directions: Direction[];
};

function parseData(data: string): string[][] {
  return data
    .trim()
    .split('\n')
    .map((line) => line.split(''));
}

type GridVisitResult = {
  isCyclic: boolean;
  numSquaresVisited?: number;
  visitedCells?: VisitedCell[][];
};

// Helper that traverses the grid and returns the number of squares visited, or null if we hit a cycle
function traverseGrid(grid: string[][]): GridVisitResult {
  // Find guard position
  let guard: Guard | null = null;
  for (let row = 0; row < grid.length; row++) {
    const col = grid[row].indexOf('^');
    if (col !== -1) {
      guard = { row, col, startRow: row, startCol: col, dx: 0, dy: -1 };
      break;
    }
  }
  if (!guard) return { isCyclic: false };

  // Keep track of visited cells and the directions we visited them with
  const visited: VisitedCell[][] = Array(grid.length)
    .fill(null)
    .map(() =>
      Array(grid[0].length)
        .fill(null)
        .map(() => ({
          visited: false,
          directions: [],
        })),
    );

  // Complete the entire path
  while (
    guard.row >= 0 &&
    guard.row < grid.length &&
    guard.col >= 0 &&
    guard.col < grid[0].length
  ) {
    // Check if we've visited this cell with this direction before
    if (
      visited[guard.row][guard.col].directions.some((d) => d.dx === guard.dx && d.dy === guard.dy)
    ) {
      return { isCyclic: true };
    }

    visited[guard.row][guard.col].visited = true;
    visited[guard.row][guard.col].directions.push({ dx: guard.dx, dy: guard.dy });

    // Keep turning right until we find an unblocked direction
    while (grid[guard.row + guard.dy]?.[guard.col + guard.dx] === '#') {
      const newDx = -guard.dy;
      const newDy = guard.dx;
      guard.dx = newDx;
      guard.dy = newDy;
    }

    guard.row += guard.dy;
    guard.col += guard.dx;
  }

  const numSquaresVisited = visited.reduce(
    (sum, row) => sum + row.filter((cell) => cell.visited).length,
    0,
  );

  return { isCyclic: false, numSquaresVisited, visitedCells: visited };
}

function D6PX(grid: string[][]): [number, number] {
  const initialResult = traverseGrid(grid);

  // If we don't have visited cells, return early
  if (!initialResult.visitedCells) return [initialResult.numSquaresVisited ?? 0, 0];

  let cycleCount = 0;
  const visitedCells = initialResult.visitedCells;

  // Find guard's starting position
  let startRow = -1,
    startCol = -1;
  for (let row = 0; row < grid.length; row++) {
    const col = grid[row].indexOf('^');
    if (col !== -1) {
      startRow = row;
      startCol = col;
      break;
    }
  }

  // Try placing an obstacle at each visited position
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      // Skip if this cell wasn't visited or is the starting position
      if (!visitedCells[row][col].visited || (row === startRow && col === startCol)) {
        continue;
      }

      // Create a copy of the grid and place an obstacle
      const testGrid = grid.map((row) => [...row]);
      testGrid[row][col] = '#';

      // Check if this creates a cycle
      const result = traverseGrid(testGrid);
      if (result.isCyclic) {
        cycleCount++;
      }
    }
  }

  return [initialResult.numSquaresVisited ?? 0, cycleCount];
}

export default function D6({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const data = parseData(rawData);
  const [part1, part2] = D6PX(data);

  return (
    <>
      <p>
        Part 1: <span className='font-mono text-lime-500'>{part1}</span>
      </p>
      <p>
        Part 2: <span className='font-mono text-lime-500'>{part2}</span>
      </p>
      <GridViz grid={data} showAxes />
    </>
  );
}
