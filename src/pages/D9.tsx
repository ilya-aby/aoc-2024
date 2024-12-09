import fullData from '../assets/inputs/D9-input.txt?raw';
import sampleData from '../assets/inputs/D9-sample.txt?raw';
import { GridViz } from '../utils/GridViz';

type Block = number | '.';

type BlockMap = {
  index: number;
  length: number;
  id: number;
};

type FreeSpaceMap = {
  index: number;
  length: number;
};

function parseData(rawData: string): {
  blocks: Block[];
  freeSpaceMap: FreeSpaceMap[];
  blockMap: BlockMap[];
} {
  const input = rawData.trim();
  const blocks: Block[] = [];
  let fileId = 0;
  const freeSpaceMap: FreeSpaceMap[] = [];
  const blockMap: BlockMap[] = [];

  for (let i = 0; i < input.length; i++) {
    const fileLength = parseInt(input[i]);

    blockMap.push({
      index: blocks.length,
      length: fileLength,
      id: fileId,
    });

    // Add file blocks
    for (let j = 0; j < fileLength; j++) {
      blocks.push(fileId);
    }

    // Add space blocks if there's a next number
    if (i + 1 < input.length) {
      const spaceLength = parseInt(input[++i]);
      // Only add to freeSpaceMap and create space blocks if length > 0
      if (spaceLength > 0) {
        freeSpaceMap.push({ index: blocks.length, length: spaceLength });
        for (let j = 0; j < spaceLength; j++) {
          blocks.push('.');
        }
      }
    }

    fileId++;
  }
  console.log(blockMap);
  return { blocks, freeSpaceMap, blockMap };
}

function calculateChecksum(blocks: Block[]): number {
  return blocks.reduce((acc: number, block: Block, index: number): number => {
    // Skip if the current block is a '.'
    if (block === '.') return acc;
    // Otherwise multiply the block number by its position and add to accumulator
    return acc + (block as number) * index;
  }, 0);
}

function D9P1(data: { blocks: Block[]; freeSpaceMap: FreeSpaceMap[] }): {
  blocks: Block[];
  checksum: number;
} {
  const blocks = [...data.blocks];
  const freeSpaceMap = [...data.freeSpaceMap];

  // Keep track of where we are in the blocks array
  let dataCursor = blocks.length - 1;
  let insertionCursor = freeSpaceMap[0].index;

  while (dataCursor > insertionCursor) {
    // Move the block from the data cursor at the end to the free space cursor
    blocks[insertionCursor] = blocks[dataCursor];
    blocks[dataCursor] = '.';

    // Slide the data cursor back until the next filled block
    while (blocks[dataCursor] === '.') {
      dataCursor--;
    }

    // If we've consumed the entire free space, remove it from the map
    if (insertionCursor >= freeSpaceMap[0].index + freeSpaceMap[0].length - 1) {
      freeSpaceMap.shift();
      // Jump the free space cursor to the start of the next free space
      insertionCursor = freeSpaceMap[0].index;
    } else {
      insertionCursor++;
    }
  }

  return { blocks, checksum: calculateChecksum(blocks) };
}

function D9P2(data: { blocks: Block[]; freeSpaceMap: FreeSpaceMap[]; blockMap: BlockMap[] }): {
  blocks: Block[];
  checksum: number;
} {
  const blocks = [...data.blocks];
  const freeSpaceMap = [...data.freeSpaceMap];
  const blockMap = [...data.blockMap];

  // Iterate over the block map in reverse order
  for (let i = blockMap.length - 1; i >= 0; i--) {
    const blockID = blockMap[i].id;
    const blockLength = blockMap[i].length;
    const blockIndex = blockMap[i].index;

    // Find first free space that can fit the current block
    for (let j = 0; j < freeSpaceMap.length; j++) {
      if (freeSpaceMap[j].length >= blockLength && freeSpaceMap[j].index < blockIndex) {
        // Clear the original block position
        for (let k = 0; k < blockLength; k++) {
          blocks[blockIndex + k] = '.';
        }

        // Insert the block into the free space
        for (let k = 0; k < blockLength; k++) {
          blocks[freeSpaceMap[j].index + k] = blockID;
        }
        // Update the free space map
        freeSpaceMap[j].index += blockLength;
        freeSpaceMap[j].length -= blockLength;
        break;
      }
    }
  }

  return { blocks, checksum: calculateChecksum(blocks) };
}

export default function D9({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const data = parseData(rawData);

  const part1Result = D9P1(data);
  const part2Result = D9P2(data);

  return (
    <>
      <p>
        Part 1: <span className='font-mono text-lime-500'>{part1Result.checksum}</span>
      </p>
      <GridViz grid={[data.blocks.slice(0, 1000)]} className='mt-4' />
      <GridViz grid={[part1Result.blocks.slice(0, 1000)]} className='mt-4' />
      <p className='mt-4'>
        Part 2: <span className='font-mono text-lime-500'>{part2Result.checksum}</span>
      </p>
      <GridViz grid={[data.blocks.slice(0, 1000)]} className='mt-4' />
      <GridViz grid={[part2Result.blocks.slice(0, 1000)]} className='mt-4' />
    </>
  );
}
