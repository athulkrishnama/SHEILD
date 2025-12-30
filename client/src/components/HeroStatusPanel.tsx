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
};

export default function HeroStatusPanel({ heroes }: HeroStatusPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {heroes.map((hero) => (
        <div key={hero._id} className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{heroEmojis[hero.name] || "🦸"}</span>
              <div>
                <h3 className="font-semibold text-lg text-white">
                  {hero.name}
                </h3>
                <p className="text-xs text-gray-400">
                  Speed: {hero.speedFactor}x
                </p>
              </div>
            </div>
            <div>
              {hero.busy ? (
                <span className="px-3 py-1 bg-red-900/50 text-red-300 rounded-full text-xs font-semibold">
                  Busy
                </span>
              ) : (
                <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-xs font-semibold">
                  Free
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Queue:</span>
              <span className="text-white font-semibold">
                {hero.queue.length} tasks
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total ETA:</span>
              <span className="text-white font-semibold">
                {formatTime(hero.totalRemainingTime)}
              </span>
            </div>
          </div>

          {hero.currentTask && (
            <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Current Delivery:</p>
              <p className="text-sm text-white font-semibold">
                {hero.currentTask.childName} - {hero.currentTask.gift}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
