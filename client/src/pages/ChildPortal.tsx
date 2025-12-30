import { useState } from "react";
import { motion } from "framer-motion";
import GiftRequestForm from "../components/GiftRequestForm";
import { SnowOverlay } from "../components/decorations/ChristmasDecor";

export default function ChildPortal() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Hero Section with Red Background */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-red mb-8 text-center"
        >
          <h1 className="text-5xl font-display font-bold mb-4 text-white">
            🎄 Santa's Gift Portal 🎅
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Tell us what you want for Christmas and our superhero team will
            deliver it!
          </p>
          <SnowOverlay />
        </motion.div>

        {/* Form or Success Message */}
        {!submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <GiftRequestForm onSuccess={() => setSubmitted(true)} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center"
          >
            <div className="text-6xl mb-4">🎁✨</div>
            <h2 className="text-3xl font-display font-bold mb-4 text-christmas-red">
              Request Submitted!
            </h2>
            <p className="text-lg text-grey-700 mb-6">
              Santa is assigning a superhero to deliver your gift!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSubmitted(false)}
              className="btn btn-primary"
            >
              Submit Another Request
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
