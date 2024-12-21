// --- Day 21: Keypad Conundrum ---
// As you teleport onto Santa's Reindeer-class starship, The Historians begin to panic: someone from their search party is missing. A quick life-form scan by the ship's computer reveals that when the missing Historian teleported, he arrived in another part of the ship.

// The door to that area is locked, but the computer can't open it; it can only be opened by physically typing the door codes (your puzzle input) on the numeric keypad on the door.

// The numeric keypad has four rows of buttons: 789, 456, 123, and finally an empty gap followed by 0A. Visually, they are arranged like this:

// +---+---+---+
// | 7 | 8 | 9 |
// +---+---+---+
// | 4 | 5 | 6 |
// +---+---+---+
// | 1 | 2 | 3 |
// +---+---+---+
//     | 0 | A |
//     +---+---+
// Unfortunately, the area outside the door is currently depressurized and nobody can go near the door. A robot needs to be sent instead.

// The robot has no problem navigating the ship and finding the numeric keypad, but it's not designed for button pushing: it can't be told to push a specific button directly. Instead, it has a robotic arm that can be controlled remotely via a directional keypad.

// The directional keypad has two rows of buttons: a gap / ^ (up) / A (activate) on the first row and < (left) / v (down) / > (right) on the second row. Visually, they are arranged like this:

//     +---+---+
//     | ^ | A |
// +---+---+---+
// | < | v | > |
// +---+---+---+
// When the robot arrives at the numeric keypad, its robotic arm is pointed at the A button in the bottom right corner. After that, this directional keypad remote control must be used to maneuver the robotic arm: the up / down / left / right buttons cause it to move its arm one button in that direction, and the A button causes the robot to briefly move forward, pressing the button being aimed at by the robotic arm.

// For example, to make the robot type 029A on the numeric keypad, one sequence of inputs on the directional keypad you could use is:

// < to move the arm from A (its initial position) to 0.
// A to push the 0 button.
// ^A to move the arm to the 2 button and push it.
// >^^A to move the arm to the 9 button and push it.
// vvvA to move the arm to the A button and push it.
// In total, there are three shortest possible sequences of button presses on this directional keypad that would cause the robot to type 029A: <A^A>^^AvvvA, <A^A^>^AvvvA, and <A^A^^>AvvvA.

// Unfortunately, the area containing this directional keypad remote control is currently experiencing high levels of radiation and nobody can go near it. A robot needs to be sent instead.

// When the robot arrives at the directional keypad, its robot arm is pointed at the A button in the upper right corner. After that, a second, different directional keypad remote control is used to control this robot (in the same way as the first robot, except that this one is typing on a directional keypad instead of a numeric keypad).

// There are multiple shortest possible sequences of directional keypad button presses that would cause this robot to tell the first robot to type 029A on the door. One such sequence is v<<A>>^A<A>AvA<^AA>A<vAAA>^A.

// Unfortunately, the area containing this second directional keypad remote control is currently -40 degrees! Another robot will need to be sent to type on that directional keypad, too.

// There are many shortest possible sequences of directional keypad button presses that would cause this robot to tell the second robot to tell the first robot to eventually type 029A on the door. One such sequence is <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A.

// Unfortunately, the area containing this third directional keypad remote control is currently full of Historians, so no robots can find a clear path there. Instead, you will have to type this sequence yourself.

// Were you to choose this sequence of button presses, here are all of the buttons that would be pressed on your directional keypad, the two robots' directional keypads, and the numeric keypad:

// <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A
// v<<A>>^A<A>AvA<^AA>A<vAAA>^A
// <A^A>^^AvvvA
// 029A
// In summary, there are the following keypads:

// One directional keypad that you are using.
// Two directional keypads that robots are using.
// One numeric keypad (on a door) that a robot is using.
// It is important to remember that these robots are not designed for button pushing. In particular, if a robot arm is ever aimed at a gap where no button is present on the keypad, even for an instant, the robot will panic unrecoverably. So, don't do that. All robots will initially aim at the keypad's A key, wherever it is.

// To unlock the door, five codes will need to be typed on its numeric keypad. For example:

// 029A
// 980A
// 179A
// 456A
// 379A
// For each of these, here is a shortest sequence of button presses you could type to cause the desired code to be typed on the numeric keypad:

// 029A: <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A
// 980A: <v<A>>^AAAvA^A<vA<AA>>^AvAA<^A>A<v<A>A>^AAAvA<^A>A<vA>^A<A>A
// 179A: <v<A>>^A<vA<A>>^AAvAA<^A>A<v<A>>^AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
// 456A: <v<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^A<A>A<vA>^A<A>A<v<A>A>^AAvA<^A>A
// 379A: <v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
// The Historians are getting nervous; the ship computer doesn't remember whether the missing Historian is trapped in the area containing a giant electromagnet or molten lava. You'll need to make sure that for each of the five codes, you find the shortest sequence of button presses necessary.

// The complexity of a single code (like 029A) is equal to the result of multiplying these two values:

// The length of the shortest sequence of button presses you need to type on your directional keypad in order to cause the code to be typed on the numeric keypad; for 029A, this would be 68.
// The numeric part of the code (ignoring leading zeroes); for 029A, this would be 29.
// In the above example, complexity of the five codes can be found by calculating 68 * 29, 60 * 980, 68 * 179, 64 * 456, and 64 * 379. Adding these together produces 126384.

// Find the fewest number of button presses you'll need to perform in order to cause the robot in front of the door to type each code. What is the sum of the complexities of the five codes on your list?

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

type StateP2 = {
  positions: Direction[];
  numericPos: NumericKeypad;
  inputSeq: string;
  cost: number;
};

function getNextPositionOnDirectionalKeypad(
  keyPress: Direction,
  currentPos: Direction,
): Direction | null {
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

  console.log(initialState);

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
      if (current.cost < 20) {
        console.log(
          `Human at L0 presses ${direction}. New state: ${newState.layer1Pos},${newState.layer2Pos},${newState.layer3Pos},${newState.inputSeq}`,
        );
      }
    }
  }

  return -1;
}

function findShortestSequenceP2(targetCode: string): number {
  const queue: StateP2[] = [];
  const visited = new Set<string>();

  // Human in L0, then 1 to LAYERS - 2 robots, then numeric keypad
  const NUM_LAYERS = 4;

  // Initial state: all robots pointing at 'A', no input sequence
  const initialState: StateP2 = {
    positions: Array(NUM_LAYERS - 2).fill('A') as Direction[],
    numericPos: 'A' as NumericKeypad,
    inputSeq: '',
    cost: 0,
  };

  console.log(initialState);

  queue.push(initialState);
  visited.add(
    `${initialState.positions.join(',')},${initialState.numericPos},${initialState.inputSeq}`,
  );

  while (queue.length > 0) {
    const current = queue.shift()!;
    const directions: Direction[] = ['<', '>', '^', 'v', 'A'];

    // Try hitting every possible key on your keypad (layer 0)
    for (const direction of directions) {
      const newPositions = [...current.positions];
      let newInputSeq = current.inputSeq;
      let newNumericPos = current.numericPos;
      let shouldContinue = false;

      // Get next position for layer 0 (your keypad)
      const nextPos = getNextPositionOnDirectionalKeypad(direction, current.positions[0]);
      if (!nextPos) continue;
      newPositions[0] = nextPos;

      // If we hit 'A', propagate through all layers
      if (direction === 'A') {
        for (let layer = 0; layer < newPositions.length - 1; layer++) {
          const nextLayerPos = getNextPositionOnDirectionalKeypad(
            current.positions[layer],
            current.positions[layer + 1],
          );

          if (!nextLayerPos) {
            shouldContinue = true;
            break;
          }
          newPositions[layer + 1] = nextLayerPos;
        }

        if (shouldContinue) continue;

        // Handle the final numeric keypad position separately
        if (current.positions[NUM_LAYERS - 4] === 'A') {
          const finalPos = getNextPositionOnNumericKeypad(
            current.positions[NUM_LAYERS - 3],
            current.numericPos,
          );

          if (!finalPos) continue;
          newNumericPos = finalPos;

          if (current.positions[NUM_LAYERS - 3] === 'A') {
            newInputSeq = current.inputSeq + finalPos;
          }

          // Check if sequence matches target code so far
          if (newInputSeq !== targetCode.substring(0, newInputSeq.length)) continue;

          // If we've reached the target code, we're done
          if (newInputSeq === targetCode) {
            return current.cost + 1;
          }
        }
      }

      const newState: StateP2 = {
        positions: newPositions,
        numericPos: newNumericPos,
        inputSeq: newInputSeq,
        cost: current.cost + 1,
      };

      const stateKey = `${newState.positions.join(',')},${newState.numericPos},${newState.inputSeq}`;
      if (!visited.has(stateKey)) {
        visited.add(stateKey);
        queue.push(newState);
      }
      if (current.cost < 20) {
        // Only log first few moves to avoid console spam
        console.log(
          `P2: Human at L0 presses ${direction}. ` +
            `Robot State: ${newPositions.join(',')},${newNumericPos} ` +
            `-- Sequence: ${newInputSeq || '(none)'}`,
        );
      }
    }
  }

  return -1;
}

function getComplexity(inputSeqLength: number, targetCode: string): number {
  // Get numeric part of code, ignoring leading zeroes
  const numericPart = parseInt(targetCode.slice(0, -1), 10); // Remove 'A' and parse as integer

  return inputSeqLength * numericPart;
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

function D21P2(data: string[]): { result: number; timing: number } {
  const start = performance.now();

  let sumOfComplexities = 0;

  let seqLength = findShortestSequence('029A');
  seqLength = findShortestSequenceP2('029A');

  for (const code of data) {
    const seqLength = findShortestSequenceP2(code);
    sumOfComplexities += getComplexity(seqLength, code);
  }

  return { timing: performance.now() - start, result: sumOfComplexities };
}

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
