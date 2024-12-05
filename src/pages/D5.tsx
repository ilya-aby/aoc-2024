import fullData from '../assets/inputs/D5-input.txt?raw';
import sampleData from '../assets/inputs/D5-sample.txt?raw';

type NodeMap = {
  [key: number]: {
    precedents: number[];
    antecedents: number[];
  };
};

function repairUpdate(sequence: number[], nodeMap: NodeMap): number[] {
  const result: number[] = [];
  const remaining = new Set(sequence);

  // Keep going until we've placed all numbers
  while (remaining.size > 0) {
    // Find a number that has no precedents among remaining numbers
    const validNext = Array.from(remaining).find((num) => {
      const node = nodeMap[num];
      // Check if any precedents are still in our remaining set
      return !node.precedents.some((pred) => remaining.has(pred));
    });

    if (validNext === undefined) {
      throw new Error('No valid next number found');
    }

    result.push(validNext);
    remaining.delete(validNext);
  }

  return result;
}

function D5PX(data: string): number[] {
  const [rulesSection, updatesSection] = data.trim().split('\n\n');

  // Parse rules into array of [num1, num2] pairs
  const rules = rulesSection.split('\n').map((line) => {
    const [num1, num2] = line.split('|').map(Number);
    return [num1, num2];
  });

  // Parse updates into arrays of numbers
  const updates = updatesSection.split('\n').map((line) => line.split(',').map(Number));

  console.log('Rules:', rules);
  console.log('Updates:', updates);

  // Create the hash map
  const nodeMap: NodeMap = {};

  // Initialize or get node
  const getNode = (num: number) => {
    if (!nodeMap[num]) {
      nodeMap[num] = { precedents: [], antecedents: [] };
    }
    return nodeMap[num];
  };

  // Build the bidirectional relationships
  for (const [num1, num2] of rules) {
    const node1 = getNode(num1);
    const node2 = getNode(num2);

    // Add num2 as an antecedent of num1
    if (!node1.antecedents.includes(num2)) {
      node1.antecedents.push(num2);
    }

    // Add num1 as a precedent of num2
    if (!node2.precedents.includes(num1)) {
      node2.precedents.push(num1);
    }
  }

  console.log('NodeMap:', nodeMap);

  let middleValueSum = 0;
  let repairedMiddleValueSum = 0;

  // Validate each update sequence
  for (const update of updates) {
    let isValid = true;

    // Check each number against subsequent numbers in the sequence
    for (let i = 0; i < update.length - 1; i++) {
      const currentNum = update[i];
      const node = nodeMap[currentNum];

      // Check if any subsequent number is in the precedents array
      for (let j = i + 1; j < update.length; j++) {
        if (node.precedents.includes(update[j])) {
          isValid = false;
          break;
        }
      }

      if (!isValid) break;
    }

    if (isValid) {
      const middleIndex = Math.floor(update.length / 2);
      const middleValue = update[middleIndex];
      middleValueSum += middleValue;
      console.log('Valid update:', update, 'Middle value:', middleValue);
    } else {
      const repairedUpdate = repairUpdate(update, nodeMap);
      const repairedMiddleValue = repairedUpdate[Math.floor(repairedUpdate.length / 2)];
      repairedMiddleValueSum += repairedMiddleValue;
      console.log('Invalid update:', update, 'Repaired update:', repairedUpdate);
    }
  }

  return [middleValueSum, repairedMiddleValueSum];
}

export default function D5({ inputType }: { inputType: 'sample' | 'full' }) {
  const data = inputType === 'sample' ? sampleData : fullData;

  return (
    <>
      <h1>Day 5</h1>
      <p>
        Part 1: <span className='font-mono text-lime-500'>{D5PX(data)[0]}</span>
      </p>
      <p>
        Part 2: <span className='font-mono text-lime-500'>{D5PX(data)[1]}</span>
      </p>
    </>
  );
}
