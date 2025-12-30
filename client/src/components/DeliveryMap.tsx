import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import {
  initializeMap,
  addDestinationMarker,
  addHeroMarker,
  addDeliveryRoute,
  animateHeroMovement,
  fitMapToRoute,
} from "../utils/mapAnimator";
import { formatTime } from "../utils/timeFormatter";

interface DeliveryMapProps {
  mapboxToken: string;
}

interface ActiveDelivery {
  requestId: string;
  heroId: string;
  heroName: string;
  childName: string;
  city: string;
  lat: number;
  lng: number;
  eta: number;
  startTime: string;
}

export default function DeliveryMap({ mapboxToken }: DeliveryMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activeDeliveries, setActiveDeliveries] = useState<ActiveDelivery[]>(
    []
  );
  const heroMarkers = useRef<Map<string, mapboxgl.Marker>>(new Map());

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current || !mapboxToken) return;

    map.current = initializeMap("delivery-map", mapboxToken);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken]);

  // Fetch active deliveries
  useEffect(() => {
    const fetchActiveDeliveries = async () => {
      try {
        console.log("Fetching active deliveries...");
        const [deliveriesRes, requestsRes, heroesRes] = await Promise.all([
          api.get("/api/heroes/deliveries/active"),
          api.get("/api/requests"),
          api.get("/api/heroes"),
        ]);

        const deliveries = deliveriesRes.data.deliveries || [];
        const requests = requestsRes.data.requests || [];
        const heroes = heroesRes.data.heroes || [];

        console.log("Active deliveries from API:", deliveries);
        console.log("All requests:", requests);
        console.log("All heroes:", heroes);

        // Enrich deliveries with request and hero data
        const enrichedDeliveries = deliveries.map((delivery: any) => {
          const request = requests.find(
            (r: any) => r._id === delivery.requestId
          );
          const hero = heroes.find((h: any) => h._id === delivery.heroId);

          console.log("Enriching delivery:", {
            deliveryId: delivery.requestId,
            request: request
              ? {
                  id: request._id,
                  city: request.city,
                  lat: request.lat,
                  lng: request.lng,
                }
              : null,
            hero: hero ? { id: hero._id, name: hero.name } : null,
            hasCurrentPosition: !!delivery.currentPosition,
            hasDestination: !!delivery.destination,
            progress: delivery.progress,
          });

          // Preserve all backend-calculated fields including currentPosition, destination, progress
          return {
            ...delivery, // Spread all backend fields first (includes currentPosition, destination, progress, remainingTime)
            heroName: hero?.name || "Unknown",
            childName: request?.childName || "Unknown",
            city: request?.city || "Unknown",
            lat: request?.lat || 0,
            lng: request?.lng || 0,
          };
        });

        console.log("Enriched deliveries:", enrichedDeliveries);
        console.log("First delivery details:", enrichedDeliveries[0]);
        if (enrichedDeliveries[0]) {
          console.log(
            "First delivery currentPosition:",
            (enrichedDeliveries[0] as any).currentPosition
          );
          console.log(
            "First delivery destination:",
            (enrichedDeliveries[0] as any).destination
          );
          console.log(
            "First delivery progress:",
            (enrichedDeliveries[0] as any).progress
          );
        }
        setActiveDeliveries(enrichedDeliveries);
      } catch (error) {
        console.error("Error fetching active deliveries:", error);
      }
    };

    fetchActiveDeliveries();
    const interval = setInterval(fetchActiveDeliveries, 5000);

    return () => clearInterval(interval);
  }, []);

  // Render deliveries on map
  useEffect(() => {
    console.log(
      "Render effect triggered. Map:",
      !!map.current,
      "Active deliveries:",
      activeDeliveries.length
    );

    if (!map.current || activeDeliveries.length === 0) {
      console.log("Skipping render - map or deliveries not ready");
      return;
    }

    console.log("Rendering deliveries on map:", activeDeliveries);

    activeDeliveries.forEach((delivery) => {
      const markerId = `hero-${delivery.heroId}`;
      console.log(
        "Processing delivery:",
        delivery,
        "Marker ID:",
        markerId,
        "Already exists:",
        heroMarkers.current.has(markerId)
      );

      // Check if marker already exists
      if (!heroMarkers.current.has(markerId)) {
        console.log(
          "Creating markers for delivery to",
          delivery.city,
          "at coords:",
          delivery.lng,
          delivery.lat
        );

        // Add destination marker
        addDestinationMarker(
          map.current!,
          delivery.lng,
          delivery.lat,
          delivery.childName,
          delivery.city
        );

        // Add delivery route
        addDeliveryRoute(
          map.current!,
          delivery.lng,
          delivery.lat,
          delivery.heroName
        );

        // Get current position from API (already calculated based on elapsed time)
        const startLng = (delivery as any).currentPosition?.lng ?? 0;
        const startLat = (delivery as any).currentPosition?.lat ?? 90;

        console.log(
          "Hero starting position:",
          { startLng, startLat },
          "Progress:",
          (delivery as any).progress
        );

        // Add hero marker at current position (not North Pole)
        const heroMarker = addHeroMarker(
          map.current!,
          startLng,
          startLat,
          delivery.heroName
        );

        heroMarkers.current.set(markerId, heroMarker);

        // Fit map to show route
        fitMapToRoute(map.current!, delivery.lng, delivery.lat);

        // Calculate remaining duration - use remainingTime from API in minutes
        const remainingMinutes =
          (delivery as any).remainingTime || delivery.eta;
        const remainingDuration = Math.max(remainingMinutes * 60 * 1000, 1000); // At least 1 second

        console.log("Animation details:", {
          hero: delivery.heroName,
          totalETA: delivery.eta,
          progress: (delivery as any).progress,
          remainingMinutes,
          remainingDuration: `${(remainingDuration / 1000).toFixed(1)}s`,
        });

        animateHeroMovement(
          heroMarker,
          delivery.lng,
          delivery.lat,
          remainingDuration,
          () => {
            console.log(`${delivery.heroName} reached destination!`);
            // Remove marker after a delay
            setTimeout(() => {
              heroMarker.remove();
              heroMarkers.current.delete(markerId);
            }, 3000);
          },
          startLng, // Pass current position as start
          startLat
        );
      }
    });
  }, [activeDeliveries]);

  if (!mapboxToken) {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl mb-4">🗺️</div>
        <h3 className="text-xl font-semibold mb-2 text-black">Map Disabled</h3>
        <p className="text-grey-700">
          Add MAPBOX_ACCESS_TOKEN to your .env file to enable map visualization
        </p>
      </div>
    );
  }

  return (
    <div className="space-y- 4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-black flex items-center gap-2">
          📍 Live Delivery Tracking
        </h2>
        <div className="flex items-center gap-2">
          <span className="badge badge-red">
            {activeDeliveries.length} Active Delivery
            {activeDeliveries.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div
        ref={mapContainer}
        id="delivery-map"
        className="map-container h-[500px] rounded-xl border border-slate-700"
      />

      {activeDeliveries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {activeDeliveries.map((delivery) => (
            <div key={delivery.requestId} className="card">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-black">
                    {delivery.heroName}
                  </h4>
                  <p className="text-sm text-grey-700">→ {delivery.city}</p>
                </div>
                <span className="badge badge-red">En Route</span>
              </div>
              <div className="text-sm text-grey-800">
                <p>
                  Delivering to:{" "}
                  <span className="text-black font-semibold">
                    {delivery.childName}
                  </span>
                </p>
                <p className="text-xs text-grey-700 mt-1">
                  ETA: {formatTime(delivery.eta)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeDeliveries.length === 0 && (
        <div className="card text-center py-8">
          <div className="text-4xl mb-3">✈️</div>
          <p className="text-grey-700">No active deliveries at the moment</p>
        </div>
      )}
    </div>
  );
}
