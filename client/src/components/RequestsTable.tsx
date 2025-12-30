import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, UserCheck, MapPin, Gift } from "lucide-react";
import { formatTime } from "../utils/timeFormatter";
import HeroAssignmentCelebration from "./HeroAssignmentCelebration";
import { playHeroMusic } from "../utils/audioPlayer";

interface Request {
  _id: string;
  childName: string;
  city: string;
  gift: string;
  giftPrice: number;
  status: string;
  assignedHero: any;
  eta: number;
  heroScores: Map<string, number>;
}

interface RequestsTableProps {
  requests: Request[];
  onAssign: () => void;
}

export default function RequestsTable({
  requests,
  onAssign,
}: RequestsTableProps) {
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [celebratingHero, setCelebratingHero] = useState<string | null>(null);

  const getRecommendations = async (requestId: string) => {
    if (expandedRequest === requestId) {
      setExpandedRequest(null);
      return;
    }

    setExpandedRequest(requestId);
    setLoadingRecs(true);

    try {
      const response = await axios.get(
        `/api/requests/${requestId}/recommendations`
      );
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      alert("Failed to load recommendations");
    } finally {
      setLoadingRecs(false);
    }
  };

  const assignHero = async (requestId: string, heroId: string) => {
    setAssigning(true);
    try {
      await axios.post(`/api/requests/${requestId}/assign`, { heroId });

      // Find the hero name from recommendations
      const assignedHero = recommendations.find((rec) => rec.heroId === heroId);
      if (assignedHero) {
        // Trigger celebration animation
        setCelebratingHero(assignedHero.name);

        // Play hero music
        playHeroMusic(assignedHero.name);
      }

      setExpandedRequest(null);
      onAssign();
    } catch (error) {
      console.error("Error assigning hero:", error);
      alert("Failed to assign hero");
    } finally {
      setAssigning(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      waiting: "status-waiting",
      assigned: "status-assigned",
      delivering: "status-delivering",
      completed: "status-completed",
    };

    return (
      statusClasses[status as keyof typeof statusClasses] ||
      statusClasses.completed
    );
  };

  return (
    <div>
      {requests.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl text-grey-700">No gift requests yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((request, index) => (
            <motion.div
              key={request._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="card hover:shadow-christmas transition-all"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black mb-1">
                    {request.childName}
                  </h3>
                  <p className="text-sm text-grey-700 flex items-center gap-1">
                    <MapPin size={14} className="text-christmas-red" />
                    {request.city}
                  </p>
                </div>
                <span
                  className={`badge ${getStatusBadge(request.status)} text-xs`}
                >
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
                </span>
              </div>

              {/* Gift Info */}
              <div className="mb-3 p-2 bg-snow-white rounded-lg">
                <p className="text-sm text-grey-800 flex items-center gap-1">
                  <Gift size={14} className="text-christmas-red" />
                  <span className="font-medium">{request.gift}</span>
                </p>
                <p className="text-xs text-grey-600 mt-1">
                  ₹{request.giftPrice}
                </p>
              </div>

              {/* Assigned Hero */}
              {request.assignedHero && (
                <div className="mb-3 p-2 bg-snow-white rounded-lg border border-border-grey">
                  <p className="text-xs text-grey-700 mb-1">Assigned to:</p>
                  <p className="text-sm text-black font-semibold flex items-center gap-1">
                    <UserCheck size={14} className="text-christmas-red" />
                    {request.assignedHero.name}
                  </p>
                  <p className="text-xs text-grey-700 mt-1">
                    ETA: {formatTime(request.eta)}
                  </p>
                </div>
              )}

              {/* Actions */}
              {request.status === "waiting" && (
                <div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => getRecommendations(request._id)}
                    className="btn btn-primary w-full flex items-center justify-center gap-2 text-sm py-2"
                    disabled={loadingRecs}
                  >
                    {expandedRequest === request._id ? (
                      <>
                        <ChevronUp size={16} />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        Assign Hero
                      </>
                    )}
                  </motion.button>

                  {/* Recommendations Modal/Overlay */}
                  <AnimatePresence>
                    {expandedRequest === request._id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setExpandedRequest(null)}
                      >
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          onClick={(e) => e.stopPropagation()}
                          className="card max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        >
                          <div className="mb-4">
                            <h3 className="text-xl font-bold text-black mb-2">
                              Hero Recommendations
                            </h3>
                            <p className="text-sm text-grey-700">
                              For {request.childName}'s {request.gift}
                            </p>
                          </div>

                          {loadingRecs ? (
                            <p className="text-center text-grey-700 py-8">
                              Loading recommendations...
                            </p>
                          ) : recommendations.length === 0 ? (
                            <p className="text-center text-grey-700 py-8">
                              No recommendations available
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {recommendations.map((rec) => (
                                <div
                                  key={rec.heroId}
                                  className="p-3 bg-snow-white rounded-lg border border-border-grey hover:border-christmas-red transition-colors"
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-black">
                                        {rec.name}
                                      </h4>
                                      <div className="flex gap-4 mt-1 text-sm text-grey-700">
                                        <span>Score: {rec.score}</span>
                                        <span>ETA: {formatTime(rec.eta)}</span>
                                        <span
                                          className={
                                            rec.status === "Free"
                                              ? "text-christmas-red font-semibold"
                                              : "text-grey-600"
                                          }
                                        >
                                          {rec.status}
                                        </span>
                                      </div>
                                    </div>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() =>
                                        assignHero(request._id, rec.heroId)
                                      }
                                      disabled={assigning}
                                      className="btn btn-success text-sm px-4 py-2"
                                    >
                                      Assign
                                    </motion.button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setExpandedRequest(null)}
                            className="btn btn-outline w-full mt-4"
                          >
                            Close
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
