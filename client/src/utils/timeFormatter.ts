/**
 * Format time in seconds to readable string
 * @param timeInSeconds - Time in seconds (could also be minutes from old data)
 * @returns Formatted time string (e.g., "1 minute 35 seconds" or "45 seconds")
 */
export function formatTime(timeInSeconds: number): string {
  console.log("[formatTime] Input value:", timeInSeconds);

  if (!timeInSeconds || timeInSeconds <= 0) {
    return "Calculating...";
  }

  // Handle legacy data: if value is less than 5, it's likely in minutes (decimal)
  // Convert to seconds for display
  let seconds = timeInSeconds;
  if (timeInSeconds < 5 && timeInSeconds > 0) {
    // Likely old data in fractional minutes - convert to seconds
    seconds = Math.round(timeInSeconds * 60);
    console.log(
      "[formatTime] Detected old format (minutes), converted to seconds:",
      seconds
    );
  } else {
    console.log("[formatTime] Using value as seconds:", seconds);
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  let result;
  if (minutes > 0) {
    if (remainingSeconds > 0) {
      result = `${minutes} minute${
        minutes !== 1 ? "s" : ""
      } ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`;
    } else {
      result = `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }
  } else {
    result = `${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`;
  }

  console.log("[formatTime] Output:", result);
  return result;
}
