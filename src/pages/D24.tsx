import fullData from '../assets/inputs/D24-input.txt?raw';
import sampleData from '../assets/inputs/D24-sample.txt?raw';
import formatDuration from '../utils/formatDuration';

type Wire = string;
type WireValue = number | null;
type WireMap = Map<Wire, WireValue>;
type Operation = 'AND' | 'OR' | 'XOR';
type Rule = {
  wire1: Wire;
  wire2: Wire;
  wire3: Wire;
  op: Operation;
};

function parseData(data: string): { wires: WireMap; rules: Rule[] } {
  const wires: WireMap = new Map<Wire, WireValue>();
  const rules: Rule[] = [];

  // Split input into lines and process each line
  const lines = data.trim().split('\n');

  // Process initial wire values
  for (const line of lines) {
    if (line.includes(':')) {
      const [wire, value] = line.split(':').map((s) => s.trim());
      wires.set(wire, parseInt(value));
    } else if (line.includes('->')) {
      // Process rules
      const [left, right] = line.split('->').map((s) => s.trim());
      const parts = left.split(' ');

      // Add all encountered wires to the map with null if not already set
      const wire3 = right;
      wires.set(wire3, wires.get(wire3) ?? null);

      if (parts.length === 3) {
        // Binary operation (AND/OR/XOR)
        const [wire1, op, wire2] = parts;
        wires.set(wire1, wires.get(wire1) ?? null);
        wires.set(wire2, wires.get(wire2) ?? null);
        rules.push({ wire1, wire2, wire3, op: op as Operation });
      }
    }
  }

  return { wires, rules };
}

function applyOperation(wire1: WireValue, wire2: WireValue, op: Operation): WireValue {
  if (wire1 === null || wire2 === null) return null;
  if (op === 'AND') return wire1 === 1 && wire2 === 1 ? 1 : 0;
  if (op === 'OR') return wire1 === 1 || wire2 === 1 ? 1 : 0;
  if (op === 'XOR') return wire1 !== wire2 ? 1 : 0;
  return null;
}

function getIntegerOutput(wires: WireMap): bigint | null {
  let binaryString = '';
  const zWires = Array.from(wires.keys())
    .filter((wire) => wire.startsWith('z'))
    .sort((a, b) => parseInt(b.slice(1)) - parseInt(a.slice(1)));

  for (const wireKey of zWires) {
    const value = wires.get(wireKey);
    if (value === null) return null;
    binaryString += value;
  }

  return BigInt(`0b${binaryString}`);
}

function processWires(wireMap: WireMap, rules: Rule[]): WireMap {
  // Create a deep copy of the wires map
  const wires = new Map(wireMap);
  let didAtLeastOneUpdate = true;
  while (didAtLeastOneUpdate) {
    didAtLeastOneUpdate = false;
    for (const rule of rules) {
      if (
        wires.get(rule.wire1) !== null &&
        wires.get(rule.wire2) !== null &&
        wires.get(rule.wire3) === null
      ) {
        wires.set(
          rule.wire3,
          applyOperation(wires.get(rule.wire1) ?? null, wires.get(rule.wire2) ?? null, rule.op),
        );
        didAtLeastOneUpdate = true;
      }
    }
  }
  return wires;
}

function D24P1(data: { wires: WireMap; rules: Rule[] }): { result: number | null; timing: number } {
  const start = performance.now();

  const wires = processWires(data.wires, data.rules);
  const result = getIntegerOutput(wires);

  return { timing: performance.now() - start, result: Number(result) };
}

// Helper to get earliest failing bit for a given wire configuration
function getEarliestFailBit(data: { wires: WireMap; rules: Rule[] }): number {
  // Get number of input bits (x00, x01, etc.)
  const maxInputBits = Array.from(data.wires.keys()).filter((wire) => wire.startsWith('x')).length;
  // Use BigInt for large numbers to prevent overflow
  const maxInteger = BigInt(2) ** BigInt(maxInputBits) - BigInt(1);

  const tests = [
    { x: 0n, y: 0n }, // Use BigInt literals with 'n' suffix
    { x: maxInteger, y: maxInteger },
    { x: maxInteger, y: 1n },
  ];

  // Add random test cases with BigInt
  const numRandomTests = 15;
  for (let i = 0; i < numRandomTests; i++) {
    const x = BigInt(Math.floor(Math.random() * Number(maxInteger)));
    const y = BigInt(Math.floor(Math.random() * Number(maxInteger)));
    tests.push({ x, y });
  }

  const failBits: number[] = [];

  for (const test of tests) {
    const expected = test.x + test.y; // BigInt addition

    // Set up test wires and run simulation
    const testWires = new Map(data.wires);
    for (let j = 0; j < maxInputBits; j++) {
      const bitPos = j.toString().padStart(2, '0');
      // Convert BigInt to binary safely
      testWires.set(`x${bitPos}`, Number((test.x >> BigInt(j)) & 1n));
      testWires.set(`y${bitPos}`, Number((test.y >> BigInt(j)) & 1n));
    }

    const result = getIntegerOutput(processWires(testWires, data.rules));

    // Treat broken circuits as failing at bit 0
    if (result === null) {
      failBits.push(0);
      continue;
    }

    if (result !== expected) {
      // Convert to binary strings for comparison
      const expectedBinary = expected.toString(2).padStart(maxInputBits + 1, '0');
      const resultBinary = result.toString(2).padStart(maxInputBits + 1, '0');

      // Find first differing bit from right to left
      for (let j = 0; j < expectedBinary.length; j++) {
        if (
          expectedBinary[expectedBinary.length - 1 - j] !==
          resultBinary[resultBinary.length - 1 - j]
        ) {
          failBits.push(j);
          break;
        }
      }
    }
  }

  return Math.min(...failBits);
}

function D24P2(data: { wires: WireMap; rules: Rule[] }): { result: number; timing: number } {
  const start = performance.now();

  // Get all possible wire pairs that could be swapped
  const allWires = Array.from(new Set(data.rules.map((r) => r.wire3)));
  const availableWires = new Set(allWires); // Track available wires
  let currentRules = [...data.rules];
  let bestScore = getEarliestFailBit({ wires: data.wires, rules: currentRules });
  console.log('bestScore', bestScore);
  let swapsFound = 0;

  while (swapsFound < 4 && bestScore < Infinity) {
    let improved = false;

    // Generate wire pairs from currently available wires
    const wirePairs = [];
    const availableWiresArray = Array.from(availableWires).sort(() => Math.random() - 0.5); // Randomize array order
    for (let i = 0; i < availableWiresArray.length; i++) {
      for (let j = i + 1; j < availableWiresArray.length; j++) {
        wirePairs.push([availableWiresArray[i], availableWiresArray[j]]);
      }
    }

    // Try each possible wire pair swap
    for (const [wire1, wire2] of wirePairs) {
      // Create new rules with this swap
      const newRules = currentRules.map((rule) => ({
        ...rule,
        wire3:
          rule.wire3 === wire1 ? wire2
          : rule.wire3 === wire2 ? wire1
          : rule.wire3,
      }));

      const score = getEarliestFailBit({ wires: data.wires, rules: newRules });
      if (score > bestScore) {
        bestScore = score;
        currentRules = newRules;
        console.log(`Found swap ${wire1}<->${wire2}, new earliest fail: ${score}`);
        // Remove both swapped wires from available wires
        availableWires.delete(wire1);
        availableWires.delete(wire2);
        swapsFound++;
        improved = true;
        break;
      }
    }

    if (!improved) break;
  }

  // Compare original rules with current rules to find all swapped wires
  const swappedWires = new Set<string>();
  for (let i = 0; i < data.rules.length; i++) {
    if (data.rules[i].wire3 !== currentRules[i].wire3) {
      swappedWires.add(data.rules[i].wire3);
      swappedWires.add(currentRules[i].wire3);
    }
  }

  // Sort the wires alphabetically and join with commas
  const swapString = Array.from(swappedWires).sort().join(',');
  console.log(`swapString: ${swapString}`);
  console.log(`Best score: ${bestScore}`);

  return { timing: performance.now() - start, result: bestScore };
}

export default function D24({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const data = parseData(rawData);
  const response1 = D24P1(data);
  const response2 = D24P2(data);

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
