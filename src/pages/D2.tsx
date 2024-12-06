import fullData from '../assets/inputs/D2-input.txt?raw';
import sampleData from '../assets/inputs/D2-sample.txt?raw';

function isSafeReport(report: number[], toleranceBit = false): boolean {
  let priorLevel = null;
  let priorDiff = null;

  for (const [index, level] of report.entries()) {
    if (priorLevel !== null) {
      const diff = level - priorLevel;
      if (diff === 0 || Math.abs(diff) > 3) {
        if (toleranceBit) {
          const withoutCurrent = [...report.slice(0, index), ...report.slice(index + 1)];
          const withoutPrevious = [...report.slice(0, index - 1), ...report.slice(index)];
          if (isSafeReport(withoutCurrent, false) || isSafeReport(withoutPrevious, false)) {
            return true;
          }
          return false;
        }
        return false;
      }
      if (priorDiff !== null) {
        if ((diff > 0 && priorDiff < 0) || (diff < 0 && priorDiff > 0)) {
          if (toleranceBit) {
            const withoutFirst = [...report.slice(1)];
            const withoutCurrent = [...report.slice(0, index), ...report.slice(index + 1)];
            const withoutPrevious = [...report.slice(0, index - 1), ...report.slice(index)];
            if (
              isSafeReport(withoutCurrent, false) ||
              isSafeReport(withoutPrevious, false) ||
              isSafeReport(withoutFirst, false)
            ) {
              return true;
            }
          }
          return false;
        }
      }
      priorDiff = diff;
    }
    priorLevel = level;
  }

  return true;
}

function D2P1(data: string): number {
  const lines = data.trim().split('\n');

  let safeCount = 0;

  for (const line of lines) {
    const report = line.split(/\s+/).map(Number);

    if (isSafeReport(report)) safeCount++;
  }

  return safeCount;
}

function D2P2(data: string): number {
  const lines = data.trim().split('\n');

  let safeCount = 0;

  for (const line of lines) {
    const report = line.split(/\s+/).map(Number);

    if (isSafeReport(report, true)) safeCount++;
  }

  return safeCount;
}

export default function D2({ inputType }: { inputType: 'sample' | 'full' }) {
  const data = inputType === 'sample' ? sampleData : fullData;

  return (
    <>
      <p>
        Safe count: <span className='font-mono text-lime-500'>{D2P1(data)}</span>
      </p>
      <p>
        Safe count with tolerance bit: <span className='font-mono text-lime-500'>{D2P2(data)}</span>
      </p>
    </>
  );
}
