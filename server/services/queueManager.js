import Hero from "../models/Hero.js";
import Request from "../models/Request.js";

/**
 * Assign a request to a hero
 * If hero is busy, add to queue; otherwise assign immediately
 * @param {string} heroId - Hero's MongoDB ID
 * @param {string} requestId - Request's MongoDB ID
 * @param {number} eta - Estimated delivery time in minutes
 * @returns {Promise<Object>} - Updated hero and request
 */
export async function assignToHero(heroId, requestId, eta) {
  const hero = await Hero.findById(heroId);
  const request = await Request.findById(requestId);

  if (!hero || !request) {
    throw new Error("Hero or Request not found");
  }

  if (hero.busy) {
    // Add to queue
    hero.queue.push(requestId);
    hero.totalRemainingTime += eta;

    request.status = "assigned";
    request.assignedHero = heroId;
    request.eta = eta;

    await hero.save();
    await request.save();

    return { hero, request, queued: true };
  } else {
    // Assign immediately
    hero.busy = true;
    hero.currentTask = requestId;
    hero.totalRemainingTime = eta;

    request.status = "delivering";
    request.assignedHero = heroId;
    request.eta = eta;

    await hero.save();
    await request.save();

    return { hero, request, queued: false };
  }
}

/**
 * Process next request in hero's queue
 * @param {string} heroId - Hero's MongoDB ID
 * @returns {Promise<Object|null>} - Next request or null if queue empty
 */
export async function processNextInQueue(heroId) {
  const hero = await Hero.findById(heroId);

  if (!hero || hero.queue.length === 0) {
    return null;
  }

  // Get next request from queue
  const nextRequestId = hero.queue.shift();
  const nextRequest = await Request.findById(nextRequestId);

  if (!nextRequest) {
    await hero.save();
    return null;
  }

  // Assign the next request
  hero.currentTask = nextRequestId;
  hero.busy = true;
  hero.totalRemainingTime = nextRequest.eta;

  nextRequest.status = "delivering";

  await hero.save();
  await nextRequest.save();

  return nextRequest;
}

/**
 * Get recommended hero for a request based on scores
 * @param {Object} heroScores - Object with hero names as keys and scores as values
 * @returns {Promise<Object>} - Recommended hero with score and ETA info
 */
export async function getRecommendedHero(heroScores) {
  console.log("Getting recommendations for scores:", heroScores);

  const heroes = await Hero.find({});
  console.log(`Found ${heroes.length} heroes in database`);

  const recommendations = heroes.map((hero) => {
    const score = heroScores[hero.name] || 0;
    console.log(`Hero: ${hero.name}, Score: ${score}`);
    return {
      heroId: hero._id,
      name: hero.name,
      score: score,
      status: hero.busy ? "Busy" : "Free",
      queueLength: hero.queue.length,
      totalRemainingTime: hero.totalRemainingTime,
    };
  });

  // Sort by score (highest first)
  recommendations.sort((a, b) => b.score - a.score);

  console.log("Final recommendations:", recommendations);
  return recommendations;
}
