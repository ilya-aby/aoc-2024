// --- Day 17: Chronospatial Computer ---
// The Historians push the button on their strange device, but this time, you all just feel like you're falling.

// "Situation critical", the device announces in a familiar voice. "Bootstrapping process failed. Initializing debugger...."

// The small handheld device suddenly unfolds into an entire computer! The Historians look around nervously before one of them tosses it to you.

// This seems to be a 3-bit computer: its program is a list of 3-bit numbers (0 through 7), like 0,1,2,3. The computer also has three registers named A, B, and C, but these registers aren't limited to 3 bits and can instead hold any integer.

// The computer knows eight instructions, each identified by a 3-bit number (called the instruction's opcode). Each instruction also reads the 3-bit number after it as an input; this is called its operand.

// A number called the instruction pointer identifies the position in the program from which the next opcode will be read; it starts at 0, pointing at the first 3-bit number in the program. Except for jump instructions, the instruction pointer increases by 2 after each instruction is processed (to move past the instruction's opcode and its operand). If the computer tries to read an opcode past the end of the program, it instead halts.

// So, the program 0,1,2,3 would run the instruction whose opcode is 0 and pass it the operand 1, then run the instruction having opcode 2 and pass it the operand 3, then halt.

// There are two types of operands; each instruction specifies the type of its operand. The value of a literal operand is the operand itself. For example, the value of the literal operand 7 is the number 7. The value of a combo operand can be found as follows:

// Combo operands 0 through 3 represent literal values 0 through 3.
// Combo operand 4 represents the value of register A.
// Combo operand 5 represents the value of register B.
// Combo operand 6 represents the value of register C.
// Combo operand 7 is reserved and will not appear in valid programs.
// The eight instructions are as follows:

// The adv instruction (opcode 0) performs division. The numerator is the value in the A register. The denominator is found by raising 2 to the power of the instruction's combo operand. (So, an operand of 2 would divide A by 4 (2^2); an operand of 5 would divide A by 2^B.) The result of the division operation is truncated to an integer and then written to the A register.

// The bxl instruction (opcode 1) calculates the bitwise XOR of register B and the instruction's literal operand, then stores the result in register B.

// The bst instruction (opcode 2) calculates the value of its combo operand modulo 8 (thereby keeping only its lowest 3 bits), then writes that value to the B register.

// The jnz instruction (opcode 3) does nothing if the A register is 0. However, if the A register is not zero, it jumps by setting the instruction pointer to the value of its literal operand; if this instruction jumps, the instruction pointer is not increased by 2 after this instruction.

// The bxc instruction (opcode 4) calculates the bitwise XOR of register B and register C, then stores the result in register B. (For legacy reasons, this instruction reads an operand but ignores it.)

// The out instruction (opcode 5) calculates the value of its combo operand modulo 8, then outputs that value. (If a program outputs multiple values, they are separated by commas.)

// The bdv instruction (opcode 6) works exactly like the adv instruction except that the result is stored in the B register. (The numerator is still read from the A register.)

// The cdv instruction (opcode 7) works exactly like the adv instruction except that the result is stored in the C register. (The numerator is still read from the A register.)

// Here are some examples of instruction operation:

// If register C contains 9, the program 2,6 would set register B to 1.
// If register A contains 10, the program 5,0,5,1,5,4 would output 0,1,2.
// If register A contains 2024, the program 0,1,5,4,3,0 would output 4,2,5,6,7,7,7,7,3,1,0 and leave 0 in register A.
// If register B contains 29, the program 1,7 would set register B to 26.
// If register B contains 2024 and register C contains 43690, the program 4,0 would set register B to 44354.
// The Historians' strange device has finished initializing its debugger and is displaying some information about the program it is trying to run (your puzzle input). For example:

// Register A: 729
// Register B: 0
// Register C: 0

// Program: 0,1,5,4,3,0
// Your first task is to determine what the program is trying to output. To do this, initialize the registers to the given values, then run the given program, collecting any output produced by out instructions. (Always join the values produced by out instructions with commas.) After the above program halts, its final output will be 4,6,3,5,6,3,5,2,1,0.

// Using the information provided by the debugger, initialize the registers to the given values, then run the program. Once it halts, what do you get if you use commas to join the values it output into a single string?
// --- Part Two ---
// Digging deeper in the device's manual, you discover the problem: this program is supposed to output another copy of the program! Unfortunately, the value in register A seems to have been corrupted. You'll need to find a new value to which you can initialize register A so that the program's output instructions produce an exact copy of the program itself.

// For example:

// Register A: 2024
// Register B: 0
// Register C: 0

// Program: 0,3,5,4,3,0
// This program outputs a copy of itself if register A is instead initialized to 117440. (The original initial value of register A, 2024, is ignored.)

// What is the lowest positive initial value for register A that causes the program to output a copy of itself?

import fullData from '../assets/inputs/D17-input.txt?raw';
import sampleData from '../assets/inputs/D17-sample.txt?raw';
import formatDuration from '../utils/formatDuration';

function parseData(data: string): {
  registers: { A: number; B: number; C: number };
  program: number[];
} {
  const [registers, program] = data.trim().split('\n\n');
  const registerValues = registers.split('\n').map((line) => {
    const [, value] = line.match(/Register \w: (\d+)/) || [];
    return parseInt(value, 10);
  });

  return {
    registers: {
      A: registerValues[0],
      B: registerValues[1],
      C: registerValues[2],
    },
    program: program.split(': ')[1].split(',').map(Number),
  };
}

function getComboOperandValue(operand: number, registers: { A: number; B: number; C: number }) {
  if (operand < 4) return operand;
  return registers[
    operand === 4 ? 'A'
    : operand === 5 ? 'B'
    : 'C'
  ];
}

function runProgram(registers: { A: number; B: number; C: number }, program: number[]): number[] {
  const regs = { ...registers };
  let ptr = 0;
  const output = [];

  while (ptr < program.length) {
    const opcode = program[ptr];
    const operand = program[ptr + 1];

    switch (opcode) {
      case 0: // adv
        regs.A = Math.floor(regs.A / Math.pow(2, getComboOperandValue(operand, regs)));
        break;
      case 1: // bxl
        regs.B = Number(BigInt(regs.B) ^ BigInt(operand));
        break;
      case 2: // bst
        regs.B = getComboOperandValue(operand, regs) % 8;
        break;
      case 3: // jnz
        // jnz jumps by 2, so we need to subtract 2 from the operand
        if (regs.A !== 0) ptr = operand - 2;
        break;
      case 4: // bxc
        regs.B = Number(BigInt(regs.B) ^ BigInt(regs.C));
        break;
      case 5: // out
        output.push(getComboOperandValue(operand, regs) % 8);
        break;
      case 6: // bdv
        regs.B = Math.floor(regs.A / Math.pow(2, getComboOperandValue(operand, regs)));
        break;
      case 7: // cdv
        regs.C = Math.floor(regs.A / Math.pow(2, getComboOperandValue(operand, regs)));
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
  registers: { A: number; B: number; C: number };
  program: number[];
}): { result: string; timing: number } {
  const start = performance.now();
  const result = runProgram(registers, program);
  return { timing: performance.now() - start, result: result.join(',') };
}

function D17P2(data: { registers: { A: number; B: number; C: number }; program: number[] }): {
  result: string;
  timing: number;
} {
  const start = performance.now();

  // A minimal A that will still produce a correct-length output
  let a = 99999999999999;

  let patternFirstSeen = -1;

  while (true) {
    const result = runProgram({ ...data.registers, A: a }, data.program);
    if (
      result[0] === data.program[0] &&
      result[1] === data.program[1] &&
      result[2] === data.program[2] &&
      result[3] === data.program[3] &&
      result[4] === data.program[4] &&
      result[5] === data.program[5]
    ) {
      console.log(`Found prefix match at ${a}. ${result.join(',')} / ${data.program.join(',')}`);
      if (patternFirstSeen !== -1) {
        console.log(`Pattern seen at ${a} with gap ${a - patternFirstSeen}`);
        break;
      }
      patternFirstSeen = a;
      console.log(`Pattern first seen at ${patternFirstSeen}`);
    }
    a++;
  }

  console.log(runProgram({ ...data.registers, A: patternFirstSeen }, data.program));
  console.log(
    runProgram({ ...data.registers, A: patternFirstSeen + (a - patternFirstSeen) }, data.program),
  );
  console.log(Number.MAX_SAFE_INTEGER);
  return {
    timing: performance.now() - start,
    result: runProgram(data.registers, data.program).join(','),
  };
}

function D17P2x(data: { registers: { A: number; B: number; C: number }; program: number[] }): {
  result: number;
  timing: number;
} {
  const start = performance.now();

  const maxIterations = 100000000000;
  const periods = [];
  for (let digit = 0; digit < data.program.length; digit++) {
    let firstValidA = -1;
    let lastValidA = -1;
    let a = 0;
    a = periods.length > 0 ? Math.max(...periods.map((p) => p.firstValidA)) : 0;

    while (a < maxIterations) {
      let skip = false;
      for (const period of periods) {
        if (!(a % period.gap <= period.firstValidA + period.length)) {
          skip = true;
          // console.log(`Skipping ${a} because it's a multiple of ${period.length}`);
          break;
        }
      }
      if (skip) {
        a++;
        continue;
      }

      const output = runProgram({ ...data.registers, A: a }, data.program);
      if (output[digit] === data.program[digit]) {
        if (firstValidA === -1) {
          firstValidA = a;
          lastValidA = a;
        } else if (a > lastValidA + 1) {
          console.log(
            `${data.program[digit]}: First seen at ${firstValidA} / Length: ${lastValidA - firstValidA} / Gap: ${a - firstValidA}`,
          );
          periods.push({
            digit,
            firstValidA,
            lastValidA,
            gap: a - firstValidA,
            length: lastValidA - firstValidA,
          });
          break;
        }
        lastValidA = a;
      }
      a++;
    }
  }
  console.log(periods);

  let a = 0;
  a = periods.length > 0 ? Math.max(...periods.map((p) => p.firstValidA)) : 0;
  let runs = 0;
  while (a < maxIterations) {
    let skip = false;
    for (const period of periods) {
      if (!(a % period.gap <= period.firstValidA + period.length)) {
        skip = true;
        // console.log(`Skipping ${a} because it's a multiple of ${period.length}`);
        break;
      }
    }
    if (skip) {
      a++;
      continue;
    }
    runs++;
    const output = runProgram({ ...data.registers, A: a }, data.program);
    if (output.join(',') === data.program.join(',')) {
      console.log(`Found ${a} after ${runs} runs`);
      break;
    }
    a++;
  }

  // for (let i = 0; i < 1; i++) {
  //   let lastValidA = 0;
  //   let a = 0;
  //   let periods=[]
  //   while (a < maxIterations) {
  //     const output = runProgram({ ...data.registers, A: a }, data.program);
  //     if (
  //       output[i] === data.program[i] &&
  //       output[i + 1] === data.program[i + 1] &&
  //       output[i + 2] === data.program[i + 2]
  //     ) {
  //       console.log(`${a} - ${output[i]} - ${output[i + 1]} - ${output[i + 2]}`);
  //       // console.log(`For digit ${i} (${data.program[i]}) - ${a}`);
  //       // break;
  //       // if (a > lastValidA + 1) {
  //       //   console.log(`${a} - ${output[i]} - Gap: ${a - lastValidA}`);
  //       // }
  //       // lastValidA = a;
  //     }
  //     a++;
  //   }
  // }
  return { timing: performance.now() - start, result: 0 };
}

export default function DX({ inputType }: { inputType: 'sample' | 'full' }) {
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
