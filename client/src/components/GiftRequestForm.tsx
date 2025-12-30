import { useState, FormEvent } from "react";
import axios from "axios";

interface GiftRequestFormProps {
  onSuccess: () => void;
}

const questions = [
  { id: "Q2", text: "Do you like Barbie dolls?", icon: "👗" },
  { id: "Q3", text: "Are you afraid of spiders?", icon: "🕷️" },
  { id: "Q4", text: "Do you like racing?", icon: "🏎️" },
  { id: "Q5", text: "Do you like water?", icon: "💧" },
  { id: "Q6", text: "Do you like magic stories?", icon: "✨" },
  { id: "Q7", text: "Do you like tiny toys?", icon: "🐜" },
  { id: "Q10", text: "Do you have a chimney?", icon: "🏠" },
];

export default function GiftRequestForm({ onSuccess }: GiftRequestFormProps) {
  const [formData, setFormData] = useState({
    childName: "",
    city: "",
    lat: 0,
    lng: 0,
    gift: "",
  });

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("/api/requests", {
        ...formData,
        answers,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = async (cityName: string) => {
    setFormData((prev) => ({ ...prev, city: cityName }));

    // Simplified geocoding - in production, use Mapbox Geocoding API
    // For demo, using some common Indian cities
    const cities: Record<string, { lat: number; lng: number }> = {
      Kochi: { lat: 9.9312, lng: 76.2673 },
      Mumbai: { lat: 19.076, lng: 72.8777 },
      Delhi: { lat: 28.6139, lng: 77.209 },
      Bangalore: { lat: 12.9716, lng: 77.5946 },
      Chennai: { lat: 13.0827, lng: 80.2707 },
    };

    if (cities[cityName]) {
      setFormData((prev) => ({
        ...prev,
        lat: cities[cityName].lat,
        lng: cities[cityName].lng,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Child Name */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-200">
          Your Name
        </label>
        <input
          type="text"
          required
          className="input"
          placeholder="Enter your name"
          value={formData.childName}
          onChange={(e) =>
            setFormData({ ...formData, childName: e.target.value })
          }
        />
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-200">
          City
        </label>
        <select
          required
          className="input"
          value={formData.city}
          onChange={(e) => handleCityChange(e.target.value)}
        >
          <option value="">Select your city</option>
          <option value="Kochi">Kochi</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Chennai">Chennai</option>
        </select>
      </div>

      {/* Gift */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-200">
          What gift do you want?
        </label>
        <input
          type="text"
          required
          className="input"
          placeholder="e.g., PS5, Bicycle, Barbie Doll"
          value={formData.gift}
          onChange={(e) => setFormData({ ...formData, gift: e.target.value })}
        />
        <p className="text-xs text-gray-400 mt-1">
          💡 Our AI will estimate the price automatically
        </p>
      </div>

      {/* Questions */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-200">
          Answer a few questions:
        </h3>
        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
            >
              <span className="text-gray-200">
                <span className="mr-2">{q.icon}</span>
                {q.text}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    answers[q.id] === "yes"
                      ? "bg-green-600 text-white"
                      : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                  }`}
                  onClick={() => setAnswers({ ...answers, [q.id]: "yes" })}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    answers[q.id] === "no"
                      ? "bg-red-600 text-white"
                      : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                  }`}
                  onClick={() => setAnswers({ ...answers, [q.id]: "no" })}
                >
                  No
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn btn-success w-full text-lg py-4"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-pulse-slow">🎁</span>
            Submitting...
          </span>
        ) : (
          "🎄 Submit Gift Request"
        )}
      </button>
    </form>
  );
}
