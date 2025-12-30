import { useState, FormEvent } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import CitySearchBox from "./CitySearchBox";

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
      await api.post("/api/requests", {
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

  const handleCitySelect = (cityName: string, lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      city: cityName,
      lat,
      lng,
    }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Child Name */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-grey-800">
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

      {/* City Search */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-grey-800">
          City
        </label>
        <CitySearchBox onCitySelect={handleCitySelect} value={formData.city} />
      </div>

      {/* Gift */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-grey-800 flex items-center gap-2">
          <Gift size={16} className="text-christmas-red" />
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
        <p className="text-xs text-grey-700 mt-1">
          💡 Our AI will estimate the price automatically
        </p>
      </div>

      {/* Questions */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-black">
          Answer a few questions:
        </h3>
        <div className="space-y-3">
          {questions.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 bg-snow-white rounded-lg border border-border-grey hover:border-christmas-red-light transition-colors"
            >
              <span className="text-grey-900 font-medium">
                <span className="mr-2">{q.icon}</span>
                {q.text}
              </span>
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    answers[q.id] === "yes"
                      ? "bg-christmas-red text-white shadow-christmas"
                      : "bg-white text-grey-700 border-2 border-border-grey hover:border-christmas-red"
                  }`}
                  onClick={() => setAnswers({ ...answers, [q.id]: "yes" })}
                >
                  Yes
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    answers[q.id] === "no"
                      ? "bg-christmas-red text-white shadow-christmas"
                      : "bg-white text-grey-700 border-2 border-border-grey hover:border-christmas-red"
                  }`}
                  onClick={() => setAnswers({ ...answers, [q.id]: "no" })}
                >
                  No
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-white border-l-4 border-christmas-red rounded-lg text-christmas-red-dark"
        >
          {error}
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full text-lg py-4"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-pulse-slow">🎁</span>
            Submitting...
          </span>
        ) : (
          "🎄 Submit Gift Request"
        )}
      </motion.button>
    </motion.form>
  );
}
