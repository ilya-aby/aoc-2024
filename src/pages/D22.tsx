import fullData from '../assets/inputs/D22-input.txt?raw';
import sampleData from '../assets/inputs/D22-sample.txt?raw';
import formatDuration from '../utils/formatDuration';

function parseData(data: string): string[] {
  return data.trim().split('\n');
}

function D22P1(data: string[]): { result: number; timing: number } {
  const start = performance.now();
  let runningSum = 0;

  for (const number of data) {
    let secret = Number(number);
    let temp;

    for (let i = 0; i < 2000; i++) {
      // Step 1: Multiply by 64, mix, then prune
      temp = secret * 64;
      secret = (secret ^ temp) >>> 0; // Mix
      secret = secret % 16777216; // Prune

      // Step 2: Divide by 32, mix, then prune
      temp = Math.floor(secret / 32);
      secret = (secret ^ temp) >>> 0; // Mix
      secret = secret % 16777216; // Prune

      // Step 3: Multiply by 2048, mix, then prune
      temp = secret * 2048;
      secret = (secret ^ temp) >>> 0; // Mix
      secret = secret % 16777216; // Prune
    }

    runningSum += secret;
  }

  return { timing: performance.now() - start, result: runningSum };
}

function D22P2(data: string[]): { result: number; timing: number } {
  const start = performance.now();

  const buyerPrices: number[][] = [];

  for (const number of data) {
    let secret = Number(number);
    let temp;
    const prices: number[] = [];

    for (let i = 0; i < 2000; i++) {
      // Step 1: Multiply by 64, mix, then prune
      temp = secret * 64;
      secret = (secret ^ temp) >>> 0; // Mix
      secret = secret % 16777216; // Prune

      // Step 2: Divide by 32, mix, then prune
      temp = Math.floor(secret / 32);
      secret = (secret ^ temp) >>> 0; // Mix
      secret = secret % 16777216; // Prune

      // Step 3: Multiply by 2048, mix, then prune
      temp = secret * 2048;
      secret = (secret ^ temp) >>> 0; // Mix
      secret = secret % 16777216; // Prune

      // Get the last digit as the price
      prices.push(secret % 10);
    }

    buyerPrices.push(prices);
  }

  const deltas: number[][] = [];

  for (let i = 0; i < buyerPrices.length; i++) {
    const prices = buyerPrices[i];
    const initialNumber = Number(data[i]);
    const deltasForBuyer: number[] = [];

    // Handle first number specially - compare with input number
    deltasForBuyer.push(prices[0] - (initialNumber % 10));

    // Calculate deltas between consecutive numbers
    for (let j = 1; j < prices.length; j++) {
      deltasForBuyer.push(prices[j] - prices[j - 1]);
    }

    deltas.push(deltasForBuyer);
  }

  const sequenceProfitMap: Map<string, { profit: number; initialBuyer: number }> = new Map();

  // Check all possible sequences of 4 deltas for each buyer
  for (let i = 0; i < buyerPrices.length; i++) {
    const pricesForBuyer = buyerPrices[i];
    const deltasForBuyer = deltas[i];

    // Check all possible sequences of 4 deltas for each buyer
    for (let j = 0; j < deltasForBuyer.length - 3; j++) {
      const sequence = deltasForBuyer.slice(j, j + 4);
      const sequenceKey = sequence.join(',');

      const currentPrice = pricesForBuyer[j + 3];

      // Only consider the first sequence that is found for each buyer
      if (sequenceProfitMap.has(sequenceKey)) {
        if (sequenceProfitMap.get(sequenceKey)!.initialBuyer === i) {
          continue;
        }

        sequenceProfitMap.set(sequenceKey, {
          profit: sequenceProfitMap.get(sequenceKey)!.profit + currentPrice,
          initialBuyer: i,
        });
      } else {
        sequenceProfitMap.set(sequenceKey, {
          profit: currentPrice,
          initialBuyer: i,
        });
      }
    }
  }

  console.log(sequenceProfitMap);

  let maxProfit = 0;
  let maxSequence = '';

  for (const [sequence, value] of sequenceProfitMap) {
    if (value.profit > maxProfit) {
      maxProfit = value.profit;
      maxSequence = sequence;
    }
  }

  console.log('Most profitable sequence:', maxSequence);
  console.log('Total profit:', maxProfit);

  return { timing: performance.now() - start, result: maxProfit };
}

export default function DX({ inputType }: { inputType: 'sample' | 'full' }) {
  const rawData = inputType === 'sample' ? sampleData : fullData;
  const data = parseData(rawData);
  const response1 = D22P1(data);
  const response2 = D22P2(data);

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
