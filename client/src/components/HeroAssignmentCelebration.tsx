import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface HeroAssignmentCelebrationProps {
  heroName: string;
  isVisible: boolean;
  onComplete: () => void;
}

const heroEmojis: Record<string, string> = {
  Flash: "⚡",
  "Spider-Man": "🕷️",
  Batman: "🦇",
  Aquaman: "🔱",
  "Ant-Man": "🐜",
  "Doctor Strange": "✨",
  "Wonder Woman": "⭐",
  "CID Moosa": "🚗",
  "Minnal Murali": "⚡",
};

export default function HeroAssignmentCelebration({
  heroName,
  isVisible,
  onComplete,
}: HeroAssignmentCelebrationProps) {
  useEffect(() => {
    if (isVisible) {
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none"
        >
          {/* Background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black pointer-events-auto"
          />

          {/* Celebration content */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: [0, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.6,
              times: [0, 0.6, 1],
              ease: "easeOut",
            }}
            className="relative z-10 text-center"
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
