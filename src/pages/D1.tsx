import fullData from '../assets/inputs/D1-input.txt?raw';
import sampleData from '../assets/inputs/D1-sample.txt?raw';

export default function D1({ inputType }: { inputType: 'sample' | 'full' }) {
  const data = inputType === 'sample' ? sampleData : fullData;
  const lines = data.trim().split('\n');
  const list1 = lines.map((line) => Number(line.split(/\s+/)[0])).sort((a, b) => a - b);
  const list2 = lines.map((line) => Number(line.split(/\s+/)[1])).sort((a, b) => a - b);

  console.log('Sorted list 1:', list1);
  console.log('Sorted list 2:', list2);

  const sumOfDifferences = list1.reduce((sum, num, i) => sum + Math.abs(num - list2[i]), 0);

  console.log('Sum of differences:', sumOfDifferences);

  // Create frequency map for list2
  const freqMap = new Map();
  list2.forEach((num) => {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  });

  // Multiply each number in list1 by its frequency in list2
  const multipliedValues = list1.map((num) => num * (freqMap.get(num) || 0));
  const sumOfMultipliedValues = multipliedValues.reduce((sum, num) => sum + num, 0);
  console.log('Sum of multiplied values:', sumOfMultipliedValues);

  return (
    <>
      <h1>Day 1</h1>
      <p>
        Sum of differences: <span className='font-mono text-lime-500'>{sumOfDifferences}</span>
      </p>
      <p>
        Sum of multiplied values:{' '}
        <span className='font-mono text-lime-500'>{sumOfMultipliedValues}</span>
      </p>
    </>
  );
}
