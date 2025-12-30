/**
 * Format decimal minutes into human-readable time with seconds precision
 * @param minutes - Time in decimal minutes (e.g., 1.583)
 * @returns Formatted string like "1 minute 35 seconds" or "47 seconds"
 */
export function formatTime(minutes: number): string {
  const totalSeconds = Math.round(minutes * 60);

  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  if (mins === 0) {
    // Only seconds
    return `${secs} ${secs === 1 ? "second" : "seconds"}`;
  } else if (secs === 0) {
    // Only minutes
    return `${mins} ${mins === 1 ? "minute" : "minutes"}`;
  } else {
    // Both minutes and seconds
    return `${mins} ${mins === 1 ? "minute" : "minutes"} ${secs} ${
      secs === 1 ? "second" : "seconds"
    }`;
  }
}
