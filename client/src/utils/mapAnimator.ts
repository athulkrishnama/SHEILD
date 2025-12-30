import mapboxgl from "mapbox-gl";

// North Pole coordinates (Santa's Workshop)
const NORTH_POLE = [0, 90];

/**
 * Initialize a Mapbox map instance
 * @param {string} container - DOM element ID for map container
 * @param {string} accessToken - Mapbox access token
 * @returns {mapboxgl.Map} - Mapbox map instance
 */
export function initializeMap(
  container: string,
  accessToken: string
): mapboxgl.Map {
  mapboxgl.accessToken = accessToken;

  const map = new mapboxgl.Map({
    container: container,
    style: "mapbox://styles/mapbox/dark-v11",
    center: [0, 20], // Start with a global view
    zoom: 1.5,
    projection: "globe" as any,
  });

  // Add navigation controls
  map.addControl(new mapboxgl.NavigationControl(), "top-right");

  // Add North Pole marker
  new mapboxgl.Marker({ color: "#FFD700" })
    .setLngLat(NORTH_POLE as [number, number])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        "<strong>🎅 Santa's Workshop</strong><br/>North Pole"
      )
    )
    .addTo(map);

  return map;
}

/**
 * Add delivery destination marker
 * @param {mapboxgl.Map} map - Mapbox map instance
 * @param {number} lng - Longitude
 * @param {number} lat - Latitude
 * @param {string} childName - Child's name
 * @param {string} city - City name
 * @returns {mapboxgl.Marker} - Marker instance
 */
export function addDestinationMarker(
  map: mapboxgl.Map,
  lng: number,
  lat: number,
  childName: string,
  city: string
): mapboxgl.Marker {
  console.log(
    `Adding destination marker at [lng=${lng}, lat=${lat}] for ${city}`
  );

  // Create custom HTML element for destination marker
  const el = document.createElement("div");
  el.className = "destination-marker";
  el.style.cssText = `
    width: 45px;
    height: 45px;
    background: #C41E3A;
    border: 3px solid white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  `;
  el.innerHTML = "🎁";

  const marker = new mapboxgl.Marker({ element: el })
    .setLngLat([lng, lat])
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<strong>🎁 Delivery for ${childName}</strong><br/>${city}`
      )
    )
    .addTo(map);

  return marker;
}

/**
 * Get hero marker color based on hero name
 * @param {string} heroName - Name of the hero
 * @returns {string} - Hex color code
 */
function getHeroColor(heroName: string): string {
  const colors: Record<string, string> = {
    Flash: "#DC143C",
    "Spider-Man": "#FF0000",
    Batman: "#000000",
    Aquaman: "#00CED1",
    "Ant-Man": "#CD5C5C",
    "Doctor Strange": "#8B008B",
    "Wonder Woman": "#FFD700",
  };
  return colors[heroName] || "#3B82F6";
}

/**
 * Get hero icon/emoji based on hero name
 * @param {string} heroName - Name of the hero
 * @returns {string} - Emoji or icon for the hero
 */
function getHeroIcon(heroName: string): string {
  const icons: Record<string, string> = {
    Flash: "⚡",
    "Spider-Man": "🕷️",
    Batman: "🦇",
    Aquaman: "🔱",
    "Ant-Man": "🐜",
    "Doctor Strange": "✨",
    "Wonder Woman": "⭐",
  };
  return icons[heroName] || "🦸";
}

/**
 * Add hero marker with custom icon
 * @param {mapboxgl.Map} map - Mapbox map instance
 * @param {number} lng - Longitude
 * @param {number} lat - Latitude
 * @param {string} heroName - Hero's name
 * @returns {mapboxgl.Marker} - Marker instance
 */
export function addHeroMarker(
  map: mapboxgl.Map,
  lng: number,
  lat: number,
  heroName: string
): mapboxgl.Marker {
  const color = getHeroColor(heroName);
  const icon = getHeroIcon(heroName);

  // Create custom HTML element for marker
  const el = document.createElement("div");
  el.className = "hero-marker";
  el.style.cssText = `
    width: 50px;
    height: 50px;
    background: ${color};
    border: 3px solid white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    transition: opacity 0.2s;
    position: relative;
  `;
  el.innerHTML = icon;

  // Add subtle hover effect without transform (to avoid animation glitches)
  el.addEventListener("mouseenter", () => {
    el.style.opacity = "0.8";
  });
  el.addEventListener("mouseleave", () => {
    el.style.opacity = "1";
  });

  const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
    .setLngLat([lng, lat])
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<strong>🦸 ${heroName}</strong><br/>En route`
      )
    )
    .addTo(map);

  return marker;
}

/**
 * Create a GeoJSON line between two points
 * @param {[number, number]} start - Start coordinates [lng, lat]
 * @param {[number, number]} end - End coordinates [lng, lat]
 * @returns {object} - GeoJSON LineString feature
 */
function createRoute(start: [number, number], end: [number, number]) {
  return {
    type: "Feature" as const,
    properties: {},
    geometry: {
      type: "LineString" as const,
      coordinates: [start, end],
    },
  };
}

/**
 * Add delivery route line to map
 * @param {mapboxgl.Map} map - Mapbox map instance
 * @param {number} destLng - Destination longitude
 * @param {number} destLat - Destination latitude
 * @param {string} heroName - Hero's name for styling
 */
export function addDeliveryRoute(
  map: mapboxgl.Map,
  destLng: number,
  destLat: number,
  heroName: string
) {
  const routeId = `route-${heroName}-${Date.now()}`;
  const route = createRoute(NORTH_POLE as [number, number], [destLng, destLat]);

  const color = getHeroColor(heroName);

  // Function to add route to map
  const addRoute = () => {
    try {
      // Check if source already exists
      if (map.getSource(routeId)) {
        return;
      }

      // Add route source
      map.addSource(routeId, {
        type: "geojson",
        data: route as any,
      });

      // Add route layer
      map.addLayer({
        id: routeId,
        type: "line",
        source: routeId,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": color,
          "line-width": 3,
          "line-opacity": 0.7,
        },
      });

      console.log(`Route added for ${heroName}`);
    } catch (error) {
      console.error("Error adding route:", error);
    }
  };

  // Add route immediately if map is loaded, otherwise wait for load event
  if (map.isStyleLoaded()) {
    addRoute();
  } else {
    map.once("load", addRoute);
  }

  return routeId;
}

/**
 * Animate hero marker along route
 * @param {mapboxgl.Marker} heroMarker - Hero marker instance
 * @param {number} destLng - Destination longitude
 * @param {number} destLat - Destination latitude
 * @param {number} durationMs - Animation duration in milliseconds
 * @param {Function} onComplete - Callback when animation completes
 * @param {number} startLng - Optional starting longitude (defaults to North Pole)
 * @param {number} startLat - Optional starting latitude (defaults to North Pole)
 */
export function animateHeroMovement(
  heroMarker: mapboxgl.Marker,
  destLng: number,
  destLat: number,
  durationMs: number,
  onComplete?: () => void,
  startLng?: number,
  startLat?: number
) {
  // Use provided start position or default to North Pole
  const initialLng = startLng ?? NORTH_POLE[0];
  const initialLat = startLat ?? NORTH_POLE[1];
  const startTime = Date.now();

  // Validate destination coordinates
  if (isNaN(destLng) || isNaN(destLat)) {
    console.error("Invalid destination coordinates for animation:", {
      destLng,
      destLat,
    });
    if (onComplete) onComplete();
    return;
  }

  console.log("Animation starting from:", { initialLng, initialLat }, "to:", {
    destLng,
    destLat,
  });

  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / durationMs, 1);

    // Linear interpolation with validation
    const currentLng = initialLng + (destLng - initialLng) * progress;
    const currentLat = initialLat + (destLat - initialLat) * progress;

    // Validate interpolated coordinates
    if (isNaN(currentLng) || isNaN(currentLat)) {
      console.error("Animation produced NaN coordinates:", {
        currentLng,
        currentLat,
        progress,
        initialLng,
        initialLat,
        destLng,
        destLat,
      });
      if (onComplete) onComplete();
      return;
    }

    // Clamp coordinates to valid ranges
    const clampedLng = Math.max(-180, Math.min(180, currentLng));
    const clampedLat = Math.max(-90, Math.min(90, currentLat));

    heroMarker.setLngLat([clampedLng, clampedLat]);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else if (onComplete) {
      onComplete();
    }
  }

  animate();
}

/**
 * Fit map bounds to show route
 * @param {mapboxgl.Map} map - Mapbox map instance
 * @param {number} destLng - Destination longitude
 * @param {number} destLat - Destination latitude
 */
export function fitMapToRoute(
  map: mapboxgl.Map,
  destLng: number,
  destLat: number
) {
  const bounds = new mapboxgl.LngLatBounds();
  bounds.extend(NORTH_POLE as [number, number]);
  bounds.extend([destLng, destLat]);

  map.fitBounds(bounds, {
    padding: 100,
    duration: 2000,
  });
}
