import fullData from '../assets/inputs/D17-input.txt?raw';
import sampleData from '../assets/inputs/D17-sample.txt?raw';
import formatDuration from '../utils/formatDuration';

function parseData(data: string): {
  registers: { A: bigint; B: bigint; C: bigint };
  program: number[];
} {
  const [registers, program] = data.trim().split('\n\n');
  const registerValues = registers.split('\n').map((line) => {
    const [, value] = line.match(/Register \w: (\d+)/) || [];
    return parseInt(value, 10);
  });

  return {
    registers: {
      A: BigInt(registerValues[0]),
      B: BigInt(registerValues[1]),
      C: BigInt(registerValues[2]),
    },
    program: program.split(': ')[1].split(',').map(Number),
  };
}

function getComboOperandValue(
  operand: number,
  registers: { A: bigint; B: bigint; C: bigint },
): bigint {
  if (operand < 4) return BigInt(operand);
  return registers[
    operand === 4 ? 'A'
    : operand === 5 ? 'B'
    : 'C'
  ];
}

function runProgram(aRegister: bigint, program: number[]): number[] {
  const regs = {
    A: aRegister,
    B: BigInt(0),
    C: BigInt(0),
  };
  let ptr = 0;
  const output = [];

  while (ptr < program.length) {
    const opcode = program[ptr];
    const operand = program[ptr + 1];

    switch (opcode) {
      case 0: // adv
        regs.A = regs.A >> BigInt(getComboOperandValue(operand, regs));
        break;
      case 1: // bxl
        regs.B = regs.B ^ BigInt(operand);
        break;
      case 2: // bst
        regs.B = BigInt(getComboOperandValue(operand, regs) % 8n);
        break;
      case 3: // jnz
        if (regs.A !== 0n) ptr = operand - 2;
        break;
      case 4: // bxc
        regs.B = regs.B ^ regs.C;
        break;
      case 5: // out
        output.push(Number(BigInt(getComboOperandValue(operand, regs)) % 8n));
        break;
      case 6: // bdv
        regs.B = regs.A >> BigInt(getComboOperandValue(operand, regs));
        break;
      case 7: // cdv
        regs.C = regs.A >> BigInt(getComboOperandValue(operand, regs));
        break;
    }
    ptr += 2;
  }

  return output;
}

function D17P1({
  registers,
  program,
}: {
  registers: { A: bigint; B: bigint; C: bigint };
  program: number[];
}): { result: string; timing: number } {
  const start = performance.now();
  const result = runProgram(registers.A, program);
  return { timing: performance.now() - start, result: result.join(',') };
}

function D17P2(data: { registers: { A: bigint; B: bigint; C: bigint }; program: number[] }): {
  result: string;
  timing: number;
} {
  const start = performance.now();
  if (data.program.length < 16) {
    return { timing: performance.now() - start, result: 'Run with full input to get result' };
  }
  // return { timing: performance.now() - start, result: 'Program length is not 16' };
  // A minimal A that will still produce a correct-length output
  let a = 100000004082074n;

  let longestPrefixSeen = 0;
  while (true) {
    const result = runProgram(a, data.program);
    // if (
    //   result[0] === data.program[0] &&
    //   result[1] === data.program[1] &&
    //   result[2] === data.program[2] &&
    //   result[3] === data.program[3] &&
    //   result[4] === data.program[4] &&
    //   result[5] === data.program[5] &&
    //   result[6] === data.program[6]
    // ) {
    //   // console.log(`Found prefix match at ${a}. ${result.join(',')} / ${data.program.join(',')}`);
    //   if (patternFirstSeen !== -1n) {
    //     console.log(`Pattern seen again at ${a}`);
    //     // break;
    //   } else {
    //     patternFirstSeen = a;
    //     console.log(`Pattern first seen at ${patternFirstSeen}`);
    //   }
    // }
    const matchingPrefix = result.findIndex((val, idx) => val !== data.program[idx]);
    const prefixLength = matchingPrefix === -1 ? result.length : matchingPrefix;
    if (prefixLength > longestPrefixSeen) {
      longestPrefixSeen = prefixLength;
      console.log(`New longest prefix seen at ${a} with length ${prefixLength}`);
    }
    a += 16777216n;

    // Exact match check
    if (result.length === data.program.length) {
      const isMatch = result.every((val, idx) => val === data.program[idx]);
      if (isMatch) {
        // Found the solution
        break;
      }
    }
    if (result.join(',') === data.program.join(',')) {
      console.log(`Found pattern at ${a}`);
      break;
    }
  }

  return {
    timing: performance.now() - start,
    result: a.toString(),
  };
}

export default function D17({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const data = parseData(rawData);
  const response1 = D17P1(data);
  const response2 = D17P2(data);

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
