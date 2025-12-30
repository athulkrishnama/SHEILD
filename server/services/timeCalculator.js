/**
 * Calculate delivery time based on distance, area difficulty, and hero speed
 * @param {number} distance - Distance from North Pole in km
 * @param {number} areaScore - Area difficulty score (0-100)
 * @param {number} speedFactor - Hero's speed factor (lower = faster)
 * @returns {number} - Estimated delivery time in minutes
 */
export function calculateDeliveryTime(distance, areaScore, speedFactor) {
  // Formula: ETA = (distance in km + area difficulty) × speed factor × time multiplier
  // The result is in minutes
  const baseTime = (distance + areaScore) * speedFactor * 0.1;

  // Cap at 1 minute maximum for demo/testing
  const cappedTime = Math.min(baseTime, 1);

  console.log(
    `ETA calculation: distance=${distance}km, areaScore=${areaScore}, speedFactor=${speedFactor}, baseTime=${baseTime.toFixed(
      2
    )}min, capped at ${cappedTime.toFixed(2)}min`
  );

  // Return precise decimal minutes (preserves seconds precision for frontend formatting)
  return Math.round(cappedTime * 100) / 100; // Round to 2 decimal places (0.01 min = ~0.6 seconds)
}
