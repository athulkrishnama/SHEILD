import { useState, useEffect } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import HeroStatusPanel from "../components/HeroStatusPanel";
import RequestsTable from "../components/RequestsTable";
import DeliveryMap from "../components/DeliveryMap";
import { SnowOverlay } from "../components/decorations/ChristmasDecor";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [requestsRes, heroesRes] = await Promise.all([
        api.get("/api/requests"),
        api.get("/api/heroes"),
      ]);

      setRequests(requestsRes.data.requests);
      setHeroes(heroesRes.data.heroes);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse-slow">🎅</div>
          <p className="text-xl text-grey-800">
            Loading Santa's Control Room...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Christmas Red */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hero-red mb-12"
      >
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-display font-bold mb-2 text-white">
            🎅 Santa's Control Room
          </h1>
          <p className="text-white/90">
            Monitor all deliveries and hero status
          </p>
        </div>
        <SnowOverlay />
      </motion.div>

      <div className="container mx-auto px-4 pb-12">
        {/* Hero Status Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4 text-black flex items-center gap-2">
            ⭐ Hero Status
          </h2>
          <HeroStatusPanel heroes={heroes} />
        </motion.div>

        {/* Live Delivery Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <DeliveryMap mapboxToken={MAPBOX_TOKEN} />
        </motion.div>

        {/* Requests Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-black flex items-center gap-2">
            🎁 Gift Requests
          </h2>
          <RequestsTable requests={requests} onAssign={fetchData} />
        </motion.div>
      </div>
    </div>
  );
}
