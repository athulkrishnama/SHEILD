/**
 * Calculate delivery time based on distance, area congestion, and hero speed
 * Returns a time in SECONDS with proper scaling and variation
 * @param {Number} distance - Distance in km
 * @param {Number} areaScore - Area congestion score (1-100)
 * @param {Number} speedFactor - Hero's speed factor (0-1, lower is faster)
 * @returns {Number} - Estimated delivery time in SECONDS (10-120s range)
 */
export function calculateDeliveryTime(distance, areaScore, speedFactor) {
  // Normalize inputs to reasonable ranges
  const normalizedDistance = Math.min(distance, 20000); // Cap at 20,000 km (half Earth)
  const normalizedArea = Math.min(Math.max(areaScore, 0), 100);

  // Base calculation: distance affects time significantly
  // Faster heroes (lower speedFactor) complete deliveries quicker
  const distanceComponent = (normalizedDistance / 500) * speedFactor;

  // Area congestion adds delay (0-30 seconds)
  const congestionComponent = (normalizedArea / 100) * 30;

  // Add randomness for variation (±10 seconds)
  const randomComponent = (Math.random() - 0.5) * 20;

  // Raw time calculation
  const rawTime = distanceComponent + congestionComponent + randomComponent;

  // Scale to fit within 10-120 seconds proportionally
  // Map from potentially large range to 10-120
  const minTime = 10;
  const maxTime = 120;

  // Use a logarithmic scale for better distribution
  const scaledTime =
    minTime + (Math.log(1 + rawTime) / Math.log(1 + 200)) * (maxTime - minTime);

  // Ensure within bounds and round to nearest second
  const finalTime = Math.round(
    Math.max(minTime, Math.min(maxTime, scaledTime))
  );

  console.log(
    `ETA calculation: distance=${distance.toFixed(
      0
    )}km, areaScore=${areaScore}, ` +
      `speedFactor=${speedFactor}, rawTime=${rawTime.toFixed(
        1
      )}s, finalTime=${finalTime}s`
  );

  return finalTime;
}
