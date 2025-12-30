import Hero from "../models/Hero.js";
import Request from "../models/Request.js";
import { processNextInQueue } from "./queueManager.js";

// Store active delivery timers
const activeDeliveries = new Map();

/**
 * Start delivery simulation for a hero
 * @param {string} heroId - Hero's MongoDB ID
 * @param {string} requestId - Request's MongoDB ID
 * @param {number} etaMinutes - Delivery time in minutes
 * @returns {string} - Delivery ID for tracking
 */
export function startDelivery(heroId, requestId, etaMinutes) {
  const deliveryId = `${heroId}-${requestId}`;

  console.log(`🚀 startDelivery called:`, {
    heroId,
    requestId,
    etaMinutes,
    deliveryId,
  });

  // Create timeout for delivery completion
  const timerId = setTimeout(async () => {
    console.log(`⏰ Delivery timer completed for: ${deliveryId}`);
    await completeDelivery(heroId, requestId);
    activeDeliveries.delete(deliveryId);
  }, etaMinutes * 60 * 1000); // Convert minutes to milliseconds

  activeDeliveries.set(deliveryId, {
    heroId,
    requestId,
    timerId,
    startTime: new Date(),
    eta: etaMinutes,
  });

  console.log(`✅ Delivery started: ${deliveryId}, ETA: ${etaMinutes} minutes`);
  console.log(`📊 Total active deliveries: ${activeDeliveries.size}`);
  console.log(`🗺️ Active deliveries map:`, Array.from(activeDeliveries.keys()));

  return deliveryId;
}

/**
 * Complete a delivery and update hero/request status
 * @param {string} heroId - Hero's MongoDB ID
 * @param {string} requestId - Request's MongoDB ID
 */
export async function completeDelivery(heroId, requestId) {
  try {
    const hero = await Hero.findById(heroId);
    const request = await Request.findById(requestId);

    if (!hero || !request) {
      console.error("Hero or Request not found for completion");
      return;
    }

    // Update request status
    request.status = "completed";
    request.completedAt = new Date();
    await request.save();

    // Send notification
    sendDeliveryNotification(request, hero);

    console.log(
      `✅ Delivery completed: ${request.childName} - ${request.gift}`
    );

    // Check if hero has queued tasks
    if (hero.queue.length > 0) {
      // Process next in queue
      const nextRequest = await processNextInQueue(heroId);

      if (nextRequest) {
        console.log(`Starting next delivery for ${hero.name}`);
        startDelivery(heroId, nextRequest._id.toString(), nextRequest.eta);
      }
    } else {
      // No more tasks, set hero to free
      hero.busy = false;
      hero.currentTask = null;
      hero.totalRemainingTime = 0;
      await hero.save();

      console.log(`${hero.name} is now free`);
    }
  } catch (error) {
    console.error("Error completing delivery:", error);
  }
}

/**
 * Cancel an active delivery
 * @param {string} deliveryId - Delivery ID
 */
export function cancelDelivery(deliveryId) {
  const delivery = activeDeliveries.get(deliveryId);

  if (delivery) {
    clearTimeout(delivery.timerId);
    activeDeliveries.delete(deliveryId);
    console.log(`Delivery cancelled: ${deliveryId}`);
    return true;
  }

  return false;
}

/**
 * Get all active deliveries
 * @returns {Array} - List of active deliveries
 */
export async function getActiveDeliveries() {
  console.log(
    `📍 getActiveDeliveries called. Map size: ${activeDeliveries.size}`
  );

  // Import the Request model to get destination coordinates
  const deliveries = await Promise.all(
    Array.from(activeDeliveries.entries()).map(async ([id, delivery]) => {
      const request = await Request.findById(delivery.requestId);

      // Calculate elapsed time and progress
      const elapsedMs = new Date() - delivery.startTime;
      const elapsedMinutes = elapsedMs / (60 * 1000);
      const totalDurationMs = delivery.eta * 60 * 1000;
      const progress = Math.min(elapsedMs / totalDurationMs, 1); // 0 to 1

      // Calculate current position (linear interpolation between North Pole and destination)
      const northPoleLng = 0;
      const northPoleLat = 90;
      const destLng = request?.lng || 0;
      const destLat = request?.lat || 0;

      const currentLng = northPoleLng + (destLng - northPoleLng) * progress;
      const currentLat = northPoleLat + (destLat - northPoleLat) * progress;

      return {
        deliveryId: id,
        heroId: delivery.heroId,
        requestId: delivery.requestId,
        startTime: delivery.startTime,
        eta: delivery.eta,
        remainingTime: Math.max(0, delivery.eta - elapsedMinutes),
        progress: progress, // 0 to 1
        currentPosition: {
          lng: currentLng,
          lat: currentLat,
        },
        destination: {
          lng: destLng,
          lat: destLat,
        },
      };
    })
  );

  console.log(
    `📦 Returning ${deliveries.length} active deliveries with positions:`,
    deliveries
  );
  return deliveries;
}

/**
 * Send delivery notification
 * @param {Object} request - Completed request
 * @param {Object} hero - Hero who completed delivery
 */
function sendDeliveryNotification(request, hero) {
  // In production, this would send email/SMS/push notifications
  // For now, we'll just log to console
  console.log("\n🎁 ========== DELIVERY NOTIFICATION ==========");
  console.log(`🦸 Hero: ${hero.name}`);
  console.log(`👦 Child: ${request.childName}`);
  console.log(`📍 Location: ${request.city}`);
  console.log(`🎁 Gift: ${request.gift}`);
  console.log(`💰 Price: ₹${request.giftPrice}`);
  console.log(`✅ Status: Delivered Successfully!`);
  console.log(`⏰ Delivered at: ${request.completedAt.toLocaleString()}`);
  console.log("============================================\n");

  // TODO: Integrate with email service (e.g., SendGrid, Nodemailer)
  // TODO: Integrate with SMS service (e.g., Twilio)
  // TODO: Integrate with push notifications (e.g., Firebase Cloud Messaging)
}
