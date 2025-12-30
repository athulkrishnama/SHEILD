import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { formatTime } from "../utils/timeFormatter";
import { getHeroImageUrl } from "../utils/heroImages";
import { useState, useMemo, memo } from "react";

interface Hero {
  _id: string;
  name: string;
  busy: boolean;
  currentTask: any;
  queue: any[];
  totalRemainingTime: number;
}

interface HeroStatusPanelProps {
  heroes: Hero[];
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

// Memoized hero avatar component
const HeroAvatar = memo(({ heroName }: { heroName: string }) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getHeroImageUrl(heroName);
  const emoji = heroEmojis[heroName] || "🦸";

  if (imgError) {
    return <span className="text-4xl">{emoji}</span>;
  }

  return (
    <img
      src={imageUrl}
      alt={heroName}
      className="w-16 h-16 rounded-full object-cover border-2 border-border-grey"
      onError={() => setImgError(true)}
    />
  );
});

HeroAvatar.displayName = "HeroAvatar";

const HeroStatusPanel = ({ heroes }: HeroStatusPanelProps) => {
  // Memoize hero cards to prevent unnecessary rerenders
  const heroCards = useMemo(() => {
    return heroes.map((hero, index) => (
      <motion.div
        key={hero._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -4 }}
        className={`card ${
          hero.busy ? "border-l-4 border-l-christmas-red" : ""
        }`}
      >
        {/* Hero Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <HeroAvatar heroName={hero.name} />
            <div>
              <h3 className="font-semibold text-lg text-black">{hero.name}</h3>
            </div>
          </div>
          <div>
            {hero.busy ? (
              <span className="badge badge-red">Busy</span>
            ) : (
              <span className="badge badge-outline">Free</span>
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-grey-700">Queue:</span>
            <span className="text-black font-semibold">
              {hero.queue.length} tasks
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-grey-700 flex items-center gap-1">
              <Clock size={14} />
              ETA:
            </span>
            <span className="font-semibold text-black">
              {hero.totalRemainingTime > 0
                ? formatTime(hero.totalRemainingTime)
                : "No active delivery"}
            </span>
          </div>
        </div>

        {hero.currentTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-snow-white rounded-lg border border-border-grey"
          >
            <p className="text-xs text-grey-700 mb-1 font-semibold">
              Current Delivery:
            </p>
            <p className="text-sm text-christmas-red font-semibold">
              {hero.currentTask.childName} - {hero.currentTask.gift}
            </p>
          </motion.div>
        )}
      </motion.div>
    ));
  }, [heroes]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {heroCards}
    </div>
  );
};

export default memo(HeroStatusPanel);
