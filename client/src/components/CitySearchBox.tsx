import { useState, useCallback } from "react";
import { MapPin } from "lucide-react";

interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number];
}

interface CitySearchBoxProps {
  onCitySelect: (city: string, lat: number, lng: number) => void;
  value: string;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";

export default function CitySearchBox({
  onCitySelect,
  value,
}: CitySearchBoxProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchCities = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    if (!MAPBOX_TOKEN) {
      console.warn("Mapbox token not found");
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${MAPBOX_TOKEN}&types=place&limit=5`
      );
      const data = await response.json();
      setSuggestions(data.features || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error searching cities:", error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    searchCities(newValue);
  };

  const handleSelectCity = (feature: MapboxFeature) => {
    const cityName = feature.place_name.split(",")[0]; // Get just the city name
    setQuery(cityName);
    onCitySelect(cityName, feature.center[1], feature.center[0]); // lat, lng
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          required
          className="input pr-10"
          placeholder="Search for your city..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          autoComplete="off"
        />
        <MapPin
          size={20}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-christmas-red pointer-events-none"
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-border-grey rounded-lg shadow-christmas max-h-60 overflow-y-auto">
          {suggestions.map((feature) => (
            <button
              key={feature.id}
              type="button"
              onClick={() => handleSelectCity(feature)}
              className="w-full px-4 py-3 text-left hover:bg-snow-white transition-colors border-b border-border-grey last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <MapPin
                  size={16}
                  className="text-christmas-red flex-shrink-0"
                />
                <span className="text-grey-900">{feature.place_name}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Loading state */}
      {isSearching && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2">
          <div className="animate-spin text-christmas-red">⌛</div>
        </div>
      )}

      {/* No results */}
      {showSuggestions &&
        !isSearching &&
        query.length >= 2 &&
        suggestions.length === 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border-2 border-border-grey rounded-lg shadow-christmas p-4">
            <p className="text-sm text-grey-700 text-center">
              No cities found. Try a different search.
            </p>
          </div>
        )}
    </div>
  );
}
