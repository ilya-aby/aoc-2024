import fullData from '../assets/inputs/D21-input.txt?raw';
import sampleData from '../assets/inputs/D21-sample.txt?raw';
import formatDuration from '../utils/formatDuration';

type Direction = '^' | 'v' | '<' | '>' | 'A';
type NumericKeypad = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'A';

function parseData(data: string): string[] {
  return data.trim().split('\n');
}

type State = {
  layer1Pos: Direction; // Position on your keypad
  layer2Pos: Direction; // Position on robot1's keypad
  layer3Pos: NumericKeypad; // Position on robot2's keypad
  inputSeq: string; // Current sequence typed on numeric keypad
  cost: number;
};

// type StateP2 = {
//   positions: Direction[];
//   numericPos: NumericKeypad;
//   inputSeq: string;
//   cost: number;
// };

function getNextPositionOnDirectionalKeypad(
  keyPress: Direction,
  currentPos: Direction,
): Direction | null {
  if (!keyPress) {
    console.log('WARNING: keyPress is null');
  }

  switch (keyPress) {
    case 'A':
      return currentPos;
    case '^':
      switch (currentPos) {
        case 'A':
          return null;
        case '^':
          return null;
        case '<':
          return null;
        case 'v':
          return '^';
        case '>':
          return 'A';
      }
      break;
    case 'v':
      switch (currentPos) {
        case 'A':
          return '>';
        case '^':
          return 'v';
        case '<':
          return null;
        case 'v':
          return null;
        case '>':
          return null;
      }
      break;
    case '<':
      switch (currentPos) {
        case 'A':
          return '^';
        case '^':
          return null;
        case '<':
          return null;
        case 'v':
          return '<';
        case '>':
          return 'v';
      }
      break;
    case '>':
      switch (currentPos) {
        case 'A':
          return null;
        case '^':
          return 'A';
        case '<':
          return 'v';
        case 'v':
          return '>';
        case '>':
          return null;
      }
      break;
  }
}

function getNextPositionOnNumericKeypad(
  keyPress: Direction,
  currentPos: NumericKeypad,
): NumericKeypad | null {
  if (!keyPress) {
    console.log('WARNING: keyPress is null');
  }

  switch (keyPress) {
    case 'A':
      return currentPos;
    case '^':
      switch (currentPos) {
        case 'A':
          return '3';
        case '0':
          return '2';
        case '1':
          return '4';
        case '2':
          return '5';
        case '3':
          return '6';
        case '4':
          return '7';
        case '5':
          return '8';
        case '6':
          return '9';
        case '7':
          return null;
        case '8':
          return null;
        case '9':
          return null;
      }
      break;
    case 'v':
      switch (currentPos) {
        case 'A':
          return null;
        case '0':
          return null;
        case '1':
          return null;
        case '2':
          return '0';
        case '3':
          return 'A';
        case '4':
          return '1';
        case '5':
          return '2';
        case '6':
          return '3';
        case '7':
          return '4';
        case '8':
          return '5';
        case '9':
          return '6';
      }
      break;
    case '<':
      switch (currentPos) {
        case 'A':
          return '0';
        case '0':
          return null;
        case '1':
          return null;
        case '2':
          return '1';
        case '3':
          return '2';
        case '4':
          return null;
        case '5':
          return '4';
        case '6':
          return '5';
        case '7':
          return null;
        case '8':
          return '7';
        case '9':
          return '8';
      }
      break;
    case '>':
      switch (currentPos) {
        case 'A':
          return null;
        case '0':
          return 'A';
        case '1':
          return '2';
        case '2':
          return '3';
        case '3':
          return null;
        case '4':
          return '5';
        case '5':
          return '6';
        case '6':
          return null;
        case '7':
          return '8';
        case '8':
          return '9';
        case '9':
          return null;
      }
      break;
  }
}

function findShortestSequence(targetCode: string): number {
  const queue: State[] = [];
  const visited = new Set<string>();

  // Initial state: all robots pointing at 'A', no input sequence
  const initialState: State = {
    layer1Pos: 'A',
    layer2Pos: 'A',
    layer3Pos: 'A',
    inputSeq: '',
    cost: 0,
  };

  let positionsExplored = 0;
  queue.push(initialState);
  visited.add(
    `${initialState.layer1Pos},${initialState.layer2Pos},${initialState.layer3Pos},${initialState.inputSeq}`,
  );

  while (queue.length > 0) {
    const current = queue.shift()!;
    let newInputSeq = current.inputSeq;
    let newLayer1Pos = current.layer1Pos;
    let newLayer2Pos = current.layer2Pos;
    let newLayer3Pos = current.layer3Pos;

    const directions: Direction[] = ['<', '>', '^', 'v', 'A'];

    // Try hitting every possible key on your numeric keypad
    for (const direction of directions) {
      positionsExplored++;
      // Get where we would be on the L1 pad after hitting this key
      const nextPosForL1 = getNextPositionOnDirectionalKeypad(direction, current.layer1Pos);

      // Skip if this key press doesn't move us to a valid position on L1 pad
      if (!nextPosForL1) continue;
      newLayer1Pos = nextPosForL1;

      // If we hit A, we need to move L2's position
      if (direction === 'A') {
        const nextPosForL2 = getNextPositionOnDirectionalKeypad(
          current.layer1Pos,
          current.layer2Pos,
        );

        // Skip if this key press doesn't move us to a valid position on L2 pad
        if (!nextPosForL2) continue;
        newLayer2Pos = nextPosForL2;

        // If we hit A, we need to move L3's position
        if (current.layer1Pos === 'A') {
          const nextPosForL3 = getNextPositionOnNumericKeypad(current.layer2Pos, current.layer3Pos);

          // Skip if this key press doesn't move us to a valid position on L3 pad
          if (!nextPosForL3) continue;
          newLayer3Pos = nextPosForL3;

          if (current.layer2Pos === 'A') {
            newInputSeq = current.inputSeq + current.layer3Pos;

            // Skip if the sequence doesn't match target code so far
            if (newInputSeq !== targetCode.substring(0, newInputSeq.length)) continue;

            // If we've reached the end of the target code, we're done
            if (newInputSeq === targetCode) {
              console.log(`P1: positionsExplored: ${positionsExplored}`);
              return current.cost + 1;
            }
          }
        }
      }

      const newState: State = {
        layer1Pos: newLayer1Pos,
        layer2Pos: newLayer2Pos,
        layer3Pos: newLayer3Pos,
        inputSeq: newInputSeq,
        cost: current.cost + 1,
      };

      const stateKey = `${newState.layer1Pos},${newState.layer2Pos},${newState.layer3Pos},${newState.inputSeq}`;
      if (!visited.has(stateKey)) {
        visited.add(stateKey);
        queue.push(newState);
      }
      if (current.cost < 4) {
        // Only log first few moves to avoid console spam
        console.log(
          `P1: Human at L0 presses ${direction}. ` +
            `Old State: ${current.layer1Pos},${current.layer2Pos},${current.layer3Pos},${current.inputSeq} ` +
            `New State: ${newState.layer1Pos},${newState.layer2Pos},${newState.layer3Pos},${newState.inputSeq}`,
        );
      }
    }
  }

  console.log(`P1: positionsExplored: ${positionsExplored}`);
  return -1;
}

// function findShortestSequenceP2(targetCode: string): number {
//   const queue: StateP2[] = [];
//   const visited = new Set<string>();

//   // Human in L0, then 1 to LAYERS - 2 robots, then numeric keypad
//   const NUM_LAYERS = 7;

//   // This array tracks the min cost at which we've reached a prefix length
//   const bestCostForPrefix = new Array(targetCode.length + 1).fill(Infinity);
//   bestCostForPrefix[0] = 0; // cost=0 => we have the empty prefix

//   // Initial state: all robots pointing at 'A', no input sequence
//   const initialState: StateP2 = {
//     positions: Array(NUM_LAYERS - 2).fill('A') as Direction[],
//     numericPos: 'A' as NumericKeypad,
//     inputSeq: '',
//     cost: 0,
//   };

//   let positionsExplored = 0;

//   queue.push(initialState);
//   visited.add(
//     `${initialState.positions.join(',')},${initialState.numericPos},${initialState.inputSeq}`,
//   );

//   while (queue.length > 0) {
//     const current = queue.shift()!;
//     const directions: Direction[] = ['<', '>', '^', 'v', 'A'];

//     // // If we've already used more than 50 moves per digit, bail out
//     // // (adjust 50 as needed)
//     // if (current.cost > (targetCode.length + 1) * NUM_LAYERS * 1000) {
//     //   continue;
//     // }

//     // // If our cost is already worse than the best-known cost for the same prefix length, prune
//     // if (current.cost > bestCostForPrefix[current.inputSeq.length] && current.inputSeq.length > 0) {
//     //   continue;
//     // }

//     for (const direction of directions) {
//       const oldPositions = [...current.positions];
//       const newPositions = [...current.positions];
//       let newInputSeq = current.inputSeq;
//       let newNumericPos = current.numericPos;
//       positionsExplored++;

//       if (positionsExplored > 10000000000000) {
//         console.log(`P2: positionsExplored: ${positionsExplored}`);
//         break;
//       }

//       // Get next position for layer 1 based on layer 0 (your keypad)
//       const nextPos = getNextPositionOnDirectionalKeypad(direction, current.positions[0]);
//       if (!nextPos) continue;
//       newPositions[0] = nextPos;

//       let propagateA = direction === 'A';
//       let currentLayer = 0;
//       let isInvalid = false;
//       while (propagateA && currentLayer < newPositions.length - 1) {
//         const nextPos = getNextPositionOnDirectionalKeypad(
//           oldPositions[currentLayer],
//           oldPositions[currentLayer + 1],
//         );
//         if (!nextPos) {
//           isInvalid = true;
//           break;
//         }
//         newPositions[currentLayer + 1] = nextPos;
//         propagateA = oldPositions[currentLayer] == 'A';
//         currentLayer++;
//       }

//       if (isInvalid) continue;

//       // Check if all robots except the last one were at 'A' in the original state
//       const allPreviousWereA = oldPositions.slice(0, -1).every((pos) => pos === 'A');

//       if (allPreviousWereA && direction === 'A') {
//         // if (newPositions[newPositions.length - 2] === 'A') {
//         const nextNumericPos = getNextPositionOnNumericKeypad(
//           newPositions[newPositions.length - 1],
//           current.numericPos,
//         );
//         if (!nextNumericPos) continue;
//         newNumericPos = nextNumericPos;

//         // If the last robot pressed 'A', we add to the input sequence
//         if (newPositions[newPositions.length - 1] === 'A') {
//           newInputSeq = current.inputSeq + current.numericPos;

//           // Skip if the sequence doesn't match target code so far
//           if (newInputSeq !== targetCode.substring(0, newInputSeq.length)) {
//             continue;
//           }

//           const costToReachPrefix = bestCostForPrefix[newInputSeq.length];
//           if (current.cost > costToReachPrefix) {
//             continue;
//           } else {
//             bestCostForPrefix[newInputSeq.length] = current.cost;
//           }

//           // If we've reached the end of the target code, we're done
//           if (newInputSeq === targetCode) {
//             console.log(`P2: positionsExplored: ${positionsExplored}`);
//             return current.cost + 1;
//           }
//         }
//       }

//       const newState: StateP2 = {
//         positions: newPositions,
//         numericPos: newNumericPos,
//         inputSeq: newInputSeq,
//         cost: current.cost + 1,
//       };

//       const stateKey = `${newState.positions.join(',')},${newState.numericPos},${newState.inputSeq}`;
//       if (!visited.has(stateKey)) {
//         visited.add(stateKey);
//         queue.push(newState);
//       }
//       if (current.cost < 2000000) {
//         // Only log first few moves to avoid console spam
//         // console.log(
//         //   `P2: Human at L0 presses ${direction}. ` +
//         //     `Old State: ${current.positions.join(',')},${current.numericPos},${current.inputSeq} ` +
//         //     `New State: ${newState.positions.join(',')},${newState.numericPos},${newState.inputSeq}`,
//         // );
//       }
//     }
//   }
//   console.log(`P2: positionsExplored: ${positionsExplored}`);
//   return -1;
// }

function getComplexity(inputSeqLength: number, targetCode: string): number {
  // Get numeric part of code, ignoring leading zeroes
  const numericPart = parseInt(targetCode.slice(0, -1), 10); // Remove 'A' and parse as integer

  return inputSeqLength * numericPart;
}

/////// Outside code
type Point = {
  x: number;
  y: number;
};

type KeypadMap = {
  [key: string]: Point;
};

const KEYPAD: KeypadMap = {
  '7': { x: 0, y: 0 },
  '8': { x: 1, y: 0 },
  '9': { x: 2, y: 0 },
  '4': { x: 0, y: 1 },
  '5': { x: 1, y: 1 },
  '6': { x: 2, y: 1 },
  '1': { x: 0, y: 2 },
  '2': { x: 1, y: 2 },
  '3': { x: 2, y: 2 },
  X: { x: 0, y: 3 },
  '0': { x: 1, y: 3 },
  A: { x: 2, y: 3 },
};

const DIRECTIONS_KEYPAD: KeypadMap = {
  X: { x: 0, y: 0 },
  '^': { x: 1, y: 0 },
  A: { x: 2, y: 0 },
  '<': { x: 0, y: 1 },
  v: { x: 1, y: 1 },
  '>': { x: 2, y: 1 },
};

const MOVES = {
  '^': { x: 0, y: -1 },
  '>': { x: 1, y: 0 },
  v: { x: 0, y: 1 },
  '<': { x: -1, y: 0 },
};

function findPaths(keypad: KeypadMap, start: string, end: string): string[] {
  if (start === end) return ['A'];

  const queue: { x: number; y: number; path: string }[] = [{ ...keypad[start], path: '' }];
  const distances: { [key: string]: number } = {};
  const paths: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.x === keypad[end].x && current.y === keypad[end].y) {
      paths.push(current.path + 'A');
      continue;
    }

    const posKey = `${current.x},${current.y}`;
    if (distances[posKey] !== undefined && distances[posKey] < current.path.length) continue;

    for (const [dir, move] of Object.entries(MOVES)) {
      const newPos = {
        x: current.x + move.x,
        y: current.y + move.y,
      };

      // Skip if moving to blank space
      if (newPos.x === keypad['X'].x && newPos.y === keypad['X'].y) continue;

      // Check if position is valid button
      const isValidButton = Object.values(keypad).some(
        (pos) => pos.x === newPos.x && pos.y === newPos.y,
      );

      if (isValidButton) {
        const newPath = current.path + dir;
        const newPosKey = `${newPos.x},${newPos.y}`;

        if (distances[newPosKey] === undefined || distances[newPosKey] >= newPath.length) {
          queue.push({ ...newPos, path: newPath });
          distances[newPosKey] = newPath.length;
        }
      }
    }
  }

  return paths.sort((a, b) => a.length - b.length);
}

function getMinKeyPresses(
  keypad: KeypadMap,
  code: string,
  robotLayers: number,
  memo: { [key: string]: number } = {},
): number {
  const memoKey = `${code},${robotLayers}`;
  if (memo[memoKey] !== undefined) return memo[memoKey];

  let current = 'A';
  let totalLength = 0;

  for (const target of code) {
    const possiblePaths = findPaths(keypad, current, target);

    if (robotLayers === 0) {
      totalLength += possiblePaths[0].length;
    } else {
      totalLength += Math.min(
        ...possiblePaths.map((path) =>
          getMinKeyPresses(DIRECTIONS_KEYPAD, path, robotLayers - 1, memo),
        ),
      );
    }
    current = target;
  }

  memo[memoKey] = totalLength;
  return totalLength;
}

function D21P2(data: string[]): { result: number; timing: number } {
  const start = performance.now();

  const result = data.reduce((sum, code) => {
    const numericPart = parseInt(code.replace(/[^0-9]/g, ''), 10);
    return sum + numericPart * getMinKeyPresses(KEYPAD, code, 25);
  }, 0);

  return { timing: performance.now() - start, result };
}

function D21P1(data: string[]): { result: number; timing: number } {
  const start = performance.now();

  let sumOfComplexities = 0;

  for (const code of data) {
    const seqLength = findShortestSequence(code);
    sumOfComplexities += getComplexity(seqLength, code);
  }

  return { timing: performance.now() - start, result: sumOfComplexities };
}

// function D21P2x(data: string[]): { result: number; timing: number } {
//   const start = performance.now();

//   let sumOfComplexities = 0;

//   for (const code of data) {
//     const seqLength = findShortestSequenceP2(code);
//     sumOfComplexities += getComplexity(seqLength, code);
//   }

//   console.log(findShortestSequence('029A'));
//   console.log(findShortestSequenceP2('029A'));

//   return { timing: performance.now() - start, result: sumOfComplexities };
// }

export default function D21({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const data = parseData(rawData);
  const response1 = D21P1(data);
  const response2 = D21P2(data);

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
