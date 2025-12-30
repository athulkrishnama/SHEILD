import mbxClient from "@mapbox/mapbox-sdk";
import mbxDirections from "@mapbox/mapbox-sdk/services/directions.js";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";

// Initialize Mapbox clients only if token is available
let directionsService = null;
let geocodingService = null;

if (process.env.MAPBOX_ACCESS_TOKEN) {
  const baseClient = mbxClient({
    accessToken: process.env.MAPBOX_ACCESS_TOKEN,
  });
  directionsService = mbxDirections(baseClient);
  geocodingService = mbxGeocoding(baseClient);
}

// Santa's Workshop at North Pole
const NORTH_POLE = {
  lat: 90.0,
  lng: 0.0,
};

/**
 * Analyze area characteristics and calculate delivery difficulty score
 * @param {number} lat - Latitude of delivery location
 * @param {number} lng - Longitude of delivery location
 * @returns {Promise<number>} - Area score (0-100, higher = more difficult)
 */
export async function analyzeArea(lat, lng) {
  try {
    // Validate input coordinates
    if (
      lat === null ||
      lat === undefined ||
      lng === null ||
      lng === undefined
    ) {
      console.error("analyzeArea received null/undefined coordinates:", {
        lat,
        lng,
      });
      return 22; // Default fallback
    }

    if (isNaN(lat) || isNaN(lng)) {
      console.error("analyzeArea received NaN coordinates:", { lat, lng });
      return 22; // Default fallback
    }

    if (!process.env.MAPBOX_ACCESS_TOKEN) {
      console.warn("MAPBOX_ACCESS_TOKEN not found, using default area score");
      return 20; // Default area score
    }

    let areaScore = 0;

    // 1. Calculate distance from North Pole (affects base delivery time)
    const distance = calculateDistance(
      NORTH_POLE.lat,
      NORTH_POLE.lng,
      lat,
      lng
    );
    const distanceScore = Math.min(distance / 100, 50); // Max 50 points, normalized per 100km
    areaScore += distanceScore;

    // 2. Elevation analysis (higher elevation = harder delivery)
    // For simplicity, we'll use latitude as a proxy
    // In production, you'd use Mapbox Tilequery API for actual elevation
    const elevationScore = Math.abs(lat) > 60 ? 15 : 5; // Arctic/Antarctic harder
    areaScore += elevationScore;

    // 3. Road density (urban vs rural)
    // This would ideally use Mapbox Matrix API or custom tileset
    // For now, using simplified heuristic
    const urbanScore = await getUrbanityScore(lat, lng);
    areaScore += urbanScore;

    // 4. Water proximity (helps Aquaman)
    // Simplified: coastal areas get lower score
    const waterScore = await getWaterProximityScore(lat, lng);
    areaScore += waterScore;

    // Cap area score between 0 and 100
    return Math.min(Math.max(areaScore, 0), 100);
  } catch (error) {
    console.error("Error analyzing area:", error.message);
    return 22; // Default fallback score
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lng1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lng2 - Longitude of point 2
 * @returns {number} - Distance in kilometers
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  // Validate inputs
  if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2)) {
    console.error("Invalid coordinates for distance calculation:", {
      lat1,
      lng1,
      lat2,
      lng2,
    });
    return 0; // Return 0 distance if invalid
  }

  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Get urbanity score (simplified heuristic)
 * In production, would use Mapbox Tilequery or custom datasets
 */
async function getUrbanityScore(lat, lng) {
  // Simplified: assume areas near major latitudes are more urban
  // Real implementation would query Mapbox for POI density
  const urbanLatitudes = [
    { lat: 28.6, lng: 77.2, name: "Delhi" },
    { lat: 19.0, lng: 72.8, name: "Mumbai" },
    { lat: 13.0, lng: 80.2, name: "Chennai" },
  ];

  for (const city of urbanLatitudes) {
    const dist = calculateDistance(lat, lng, city.lat, city.lng);
    if (dist < 50) return 5; // Urban, easier delivery
  }

  return 15; // Rural, harder delivery
}

/**
 * Get water proximity score
 * Simplified heuristic for demo
 */
async function getWaterProximityScore(lat, lng) {
  // Simplified: Check if near known coastal coordinates
  // In production, would use Mapbox Tilequery to check for water features
  const coastalThreshold = 10; // degrees from known coasts

  // Very simplified - just check latitude ranges known to be coastal
  if (Math.abs(lng) > 70 && Math.abs(lng) < 90) {
    return 5; // Likely coastal
  }

  return 10; // Inland
}

export { calculateDistance };
