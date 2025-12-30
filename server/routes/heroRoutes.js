import express from "express";
import Hero from "../models/Hero.js";
import Request from "../models/Request.js";
import { getActiveDeliveries } from "../services/deliverySimulator.js";

const router = express.Router();

/**
 * GET /api/heroes - Get all heroes with their current status
 */
router.get("/", async (req, res) => {
  try {
    const heroes = await Hero.find({})
      .populate("currentTask")
      .populate("queue");

    res.json({ heroes });
  } catch (error) {
    console.error("Error fetching heroes:", error);
    res.status(500).json({ error: "Failed to fetch heroes" });
  }
});

/**
 * GET /api/heroes/:id - Get specific hero details
 */
router.get("/:id", async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id)
      .populate("currentTask")
      .populate("queue");

    if (!hero) {
      return res.status(404).json({ error: "Hero not found" });
    }

    res.json({ hero });
  } catch (error) {
    console.error("Error fetching hero:", error);
    res.status(500).json({ error: "Failed to fetch hero" });
  }
});

/**
 * GET /api/heroes/:id/queue - Get hero's delivery queue
 */
router.get("/:id/queue", async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id).populate("queue");

    if (!hero) {
      return res.status(404).json({ error: "Hero not found" });
    }

    res.json({ queue: hero.queue });
  } catch (error) {
    console.error("Error fetching queue:", error);
    res.status(500).json({ error: "Failed to fetch queue" });
  }
});

/**
 * GET /api/heroes/deliveries/active - Get all active deliveries
 */
router.get("/deliveries/active", async (req, res) => {
  try {
    const activeDeliveries = await getActiveDeliveries();
    res.json({ deliveries: activeDeliveries });
  } catch (error) {
    console.error("Error fetching active deliveries:", error);
    res.status(500).json({ error: "Failed to fetch active deliveries" });
  }
});

export default router;
