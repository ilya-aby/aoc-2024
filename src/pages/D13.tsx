import fullData from '../assets/inputs/D13-input.txt?raw';
import sampleData from '../assets/inputs/D13-sample.txt?raw';
import formatDuration from '../utils/formatDuration';

type Button = {
  xMove: number;
  yMove: number;
};

type Machine = {
  buttonA: Button;
  buttonB: Button;
  prize: {
    x: number;
    y: number;
  };
};

function parseData(data: string): Machine[] {
  return data
    .trim()
    .split('\n\n') // Split by double newline to separate each machine
    .map((machineStr) => {
      const lines = machineStr.split('\n');

      // Parse Button A
      const buttonAMatch = lines[0].match(/X\+(\d+), Y\+(\d+)/);
      const buttonA: Button = {
        xMove: buttonAMatch ? parseInt(buttonAMatch[1]) : 0,
        yMove: buttonAMatch ? parseInt(buttonAMatch[2]) : 0,
      };

      // Parse Button B
      const buttonBMatch = lines[1].match(/X\+(\d+), Y\+(\d+)/);
      const buttonB: Button = {
        xMove: buttonBMatch ? parseInt(buttonBMatch[1]) : 0,
        yMove: buttonBMatch ? parseInt(buttonBMatch[2]) : 0,
      };

      // Parse Prize
      const prizeMatch = lines[2].match(/X=(\d+), Y=(\d+)/);
      const prize = {
        x: prizeMatch ? parseInt(prizeMatch[1]) : 0,
        y: prizeMatch ? parseInt(prizeMatch[2]) : 0,
      };

      return {
        buttonA,
        buttonB,
        prize,
      };
    });
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

function D13P1(data: Machine[]): { result: number; timing: number } {
  const start = performance.now();

  const aCost = 3;
  const bCost = 1;

  let totalCost = 0;

  // For each machine, first check if the buttons are coprime
  for (const machine of data) {
    const gcdX = gcd(machine.buttonA.xMove, machine.buttonB.xMove);
    const gcdY = gcd(machine.buttonA.yMove, machine.buttonB.yMove);

    // If the prize is not a multiple of the gcd, then there is no solution
    // The only winning move is not to play.
    if (machine.prize.x % gcdX !== 0 || machine.prize.y % gcdY !== 0) {
      continue;
    }

    // Brute force the number of presses for each button
    // Since we are given that each button can be pressed at most 100 times, we can just try all 100 presses
    let minCost = Infinity;
    for (let aPresses = 0; aPresses <= 100; aPresses++) {
      for (let bPresses = 0; bPresses <= 100; bPresses++) {
        if (
          machine.buttonA.xMove * aPresses + machine.buttonB.xMove * bPresses === machine.prize.x &&
          machine.buttonA.yMove * aPresses + machine.buttonB.yMove * bPresses === machine.prize.y
        ) {
          const cost = aCost * aPresses + bCost * bPresses;
          if (cost < minCost) {
            minCost = cost;
          }
        }
      }
    }

    // If didn't hit solution within 100 presses, then there is no reachable solution
    if (minCost === Infinity) {
      continue;
    }

    totalCost += minCost;
  }

  const result = totalCost;
  const timing = performance.now() - start;
  return { timing, result };
}

function D13P2(data: Machine[]): { result: number; timing: number } {
  const start = performance.now();

  // Create a deep copy of the data and modify the prize coordinates
  const modifiedData = data.map((machine) => ({
    ...machine,
    prize: {
      x: machine.prize.x + 10000000000000,
      y: machine.prize.y + 10000000000000,
    },
  }));

  console.log(modifiedData);

  let totalCost = 0;

  for (const machine of modifiedData) {
    const { buttonA, buttonB, prize } = machine;

    const denominator = buttonA.xMove * buttonB.yMove - buttonA.yMove * buttonB.xMove;
    if (denominator === 0) continue; // No solution if determinant is 0

    const pressesA = (prize.x * buttonB.yMove - prize.y * buttonB.xMove) / denominator;
    const pressesB = (buttonA.xMove * prize.y - buttonA.yMove * prize.x) / denominator;

    if (pressesA >= 0 && pressesB >= 0 && pressesA % 1 === 0 && pressesB % 1 === 0) {
      totalCost += pressesA * 3 + pressesB;
    }
    console.log(totalCost);
  }

  return {
    result: totalCost,
    timing: performance.now() - start,
  };
}

export default function D13({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const data = parseData(rawData);
  const response1 = D13P1(data);
  const response2 = D13P2(data);

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
