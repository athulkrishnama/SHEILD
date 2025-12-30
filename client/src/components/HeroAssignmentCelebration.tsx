import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getHeroImageUrl } from "../utils/heroImages";

interface HeroAssignmentCelebrationProps {
  heroName: string;
  heroEmoji: string;
  onComplete: () => void;
}

const heroEmojis: { [key: string]: string } = {
  Superman: "🦸‍♂️",
  Batman: "🦇",
  "Wonder Woman": "👸",
  Flash: "⚡",
  Aquaman: "🌊",
  "Spider-Man": "🕷️",
  "Iron Man": "🤖",
  Hulk: "💚",
  "Black Panther": "🐆",
  "Captain America": "🛡️",
  "Ant-Man": "🐜",
  "Minnal Murali": "⚡",
  "CID Moosa": "🚗",
};

export default function HeroAssignmentCelebration({
  heroName,
  heroEmoji,
  onComplete,
}: HeroAssignmentCelebrationProps) {
  const [imageError, setImageError] = useState(false);
  const heroImageUrl = getHeroImageUrl(heroName);
  const displayEmoji = heroEmojis[heroName] || heroEmoji || "🦸";

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="relative"
        >
          >
            {/* Hero emoji */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="text-9xl mb-4"
            >
              {heroEmojis[heroName] || "🦸"}
            </motion.div>

            {/* Hero name */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-display font-bold text-white mb-2"
            >
              {heroName}
            </motion.h2>

            {/* Assignment message */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-white/90"
            >
              Hero Assigned! 🎄
            </motion.p>

            {/* Sparkle effects */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  scale: 0,
                  x: 0,
                  y: 0,
                  opacity: 1,
                }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * Math.PI) / 4) * 150,
                  y: Math.sin((i * Math.PI) / 4) * 150,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 1,
                  delay: 0.5,
                  ease: "easeOut",
                }}
                className="absolute top-1/2 left-1/2 text-4xl"
              >
                ✨
              </motion.div>
            ))}

            {/* Confetti */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`confetti-${i}`}
                initial={{
                  x: 0,
                  y: -50,
                  opacity: 1,
                  rotate: 0,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 400,
                  y: [0, 200, 400],
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 720,
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 0.5,
                  ease: "easeOut",
                }}
                className="absolute top-0 left-1/2 w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ["#D62828", "#FFFFFF", "#E63946"][
                    Math.floor(Math.random() * 3)
                  ],
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
