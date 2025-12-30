import express from "express";
import Request from "../models/Request.js";
import Hero from "../models/Hero.js";
import { predictGiftPrice } from "../services/pricePredictor.js";
import { calculateHeroScores } from "../services/heroScorer.js";
import { analyzeArea, calculateDistance } from "../services/areaAnalyzer.js";
import { calculateDeliveryTime } from "../services/timeCalculator.js";
import { assignToHero, getRecommendedHero } from "../services/queueManager.js";
import { startDelivery } from "../services/deliverySimulator.js";

const router = express.Router();

/**
 * POST /api/requests - Submit a new gift request
 */
router.post("/", async (req, res) => {
  try {
    const { childName, city, lat, lng, gift, answers } = req.body;

    // Validate required fields
    if (!childName || !city || !lat || !lng || !gift || !answers) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Predict gift price using AI
    console.log(`Predicting price for: ${gift}`);
    const giftPrice = await predictGiftPrice(gift);
    console.log(`Predicted price: ₹${giftPrice}`);

    // Calculate hero scores
    const heroScores = calculateHeroScores(answers, giftPrice);
    console.log("Hero scores:", heroScores);

    // Create request
    const request = new Request({
      childName,
      city,
      lat,
      lng,
      gift,
      giftPrice,
      answers: new Map(Object.entries(answers)),
      heroScores: new Map(Object.entries(heroScores)),
      status: "waiting",
    });

    await request.save();

    res.status(201).json({
      success: true,
      request: request,
      message: "Gift request submitted successfully!",
    });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ error: "Failed to create request" });
  }
});

/**
 * GET /api/requests - Get all requests
 */
router.get("/", async (req, res) => {
  try {
    const requests = await Request.find({})
      .populate("assignedHero")
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

/**
 * GET /api/requests/:id - Get specific request
 */
router.get("/:id", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate(
      "assignedHero"
    );

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json({ request });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Failed to fetch request" });
  }
});

/**
 * POST /api/requests/:id/assign - Assign a hero to a request
 */
router.post("/:id/assign", async (req, res) => {
  try {
    const { heroId } = req.body;
    const requestId = req.params.id;

    if (!heroId) {
      return res.status(400).json({ error: "Hero ID required" });
    }

    const request = await Request.findById(requestId);
    const hero = await Hero.findById(heroId);

    if (!request || !hero) {
      return res.status(404).json({ error: "Request or Hero not found" });
    }

    // Calculate area score and ETA
    const areaScore = await analyzeArea(request.lat, request.lng);
    const distance = calculateDistance(90, 0, request.lat, request.lng); // From North Pole
    const eta = calculateDeliveryTime(distance, areaScore, hero.speedFactor);

    // Update request with ETA
    request.eta = eta;
    await request.save();

    // Assign to hero
    const result = await assignToHero(heroId, requestId, eta);

    // Start delivery simulation if not queued
    if (!result.queued) {
      startDelivery(heroId, requestId, eta);
    }

    res.json({
      success: true,
      message: result.queued ? "Added to hero queue" : "Delivery started",
      hero: result.hero,
      request: result.request,
      eta: eta,
      queued: result.queued,
    });
  } catch (error) {
    console.error("Error assigning hero:", error);
    res.status(500).json({ error: "Failed to assign hero" });
  }
});

/**
 * GET /api/requests/:id/recommendations - Get hero recommendations for a request
 */
router.get("/:id/recommendations", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Convert Map to plain object
    const heroScores = Object.fromEntries(request.heroScores);
    const recommendations = await getRecommendedHero(heroScores);

    // Calculate ETA for each hero
    const areaScore = await analyzeArea(request.lat, request.lng);
    const distance = calculateDistance(90, 0, request.lat, request.lng);

    const heroes = await Hero.find({});
    const enrichedRecommendations = recommendations.map((rec) => {
      const hero = heroes.find(
        (h) => h._id.toString() === rec.heroId.toString()
      );
      const eta = calculateDeliveryTime(distance, areaScore, hero.speedFactor);

      return {
        ...rec,
        eta: eta,
        speedFactor: hero.speedFactor,
      };
    });

    res.json({ recommendations: enrichedRecommendations });
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
});

export default router;
