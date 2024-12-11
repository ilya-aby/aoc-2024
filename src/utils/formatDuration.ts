export default function formatDuration(ms: number): string {
  if (ms < 1000) {
    // Less than 1 second, show milliseconds
    return ms < 10 ? `${ms.toFixed(1)}ms` : `${Math.round(ms)}ms`;
  } else if (ms < 60000) {
    // Less than 1 minute, show seconds
    const seconds = ms / 1000;
    return seconds < 10 ? `${seconds.toFixed(1)}s` : `${Math.round(seconds)}s`;
  } else {
    // 1 minute or more, show minutes and seconds
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.round((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }
}
