import { motion } from "framer-motion";
import { Activity, Clock } from "lucide-react";
import { formatTime } from "../utils/timeFormatter";

interface Hero {
  _id: string;
  name: string;
  speedFactor: number;
  busy: boolean;
  currentTask: any;
  queue: any[];
  totalRemainingTime: number;
}

interface HeroStatusPanelProps {
  heroes: Hero[];
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

export default function HeroStatusPanel({ heroes }: HeroStatusPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {heroes.map((hero, index) => (
        <motion.div
          key={hero._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{heroEmojis[hero.name] || "🦸"}</span>
              <div>
                <h3 className="font-semibold text-lg text-black">
                  {hero.name}
                </h3>
                <p className="text-xs text-grey-700 flex items-center gap-1">
                  <Activity size={12} />
                  Speed: {hero.speedFactor}x
                </p>
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
                Total ETA:
              </span>
              <span className="text-black font-semibold">
                {formatTime(hero.totalRemainingTime)}
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
      ))}
    </div>
  );
}
