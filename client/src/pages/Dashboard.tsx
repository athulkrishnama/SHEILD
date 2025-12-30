import { useState, useEffect } from "react";
import axios from "axios";
import HeroStatusPanel from "../components/HeroStatusPanel";
import RequestsTable from "../components/RequestsTable";
import DeliveryMap from "../components/DeliveryMap";

// Get Mapbox token from environment or use empty string
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // Poll every 5 seconds for updates
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [requestsRes, heroesRes] = await Promise.all([
        axios.get("/api/requests"),
        axios.get("/api/heroes"),
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
          <p className="text-xl text-gray-300">
            Loading Santa's Control Room...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold mb-2 bg-gradient-to-r from-hero-blue to-hero-purple bg-clip-text text-transparent">
          🎅 Santa's Control Room
        </h1>
        <p className="text-gray-400">Monitor all deliveries and hero status</p>
      </div>

      {/* Hero Status Panel */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-white">Hero Status</h2>
        <HeroStatusPanel heroes={heroes} />
      </div>

      {/* Live Delivery Map */}
      <div className="mb-8">
        <DeliveryMap mapboxToken={MAPBOX_TOKEN} />
      </div>

      {/* Requests Table */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-white">
          Gift Requests
        </h2>
        <RequestsTable requests={requests} onAssign={fetchData} />
      </div>
    </div>
  );
}
