import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, UserCheck } from "lucide-react";
import { formatTime } from "../utils/timeFormatter";

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
    <div className="space-y-4">
      {requests.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl text-grey-700">No gift requests yet</p>
        </div>
      ) : (
        requests.map((request, index) => (
          <motion.div
            key={request._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-1">
                  {request.childName} - {request.city}
                </h3>
                <p className="text-grey-800">
                  🎁 {request.gift}{" "}
                  <span className="text-grey-600">(₹{request.giftPrice})</span>
                </p>
              </div>
              <div>
                <span className={`badge ${getStatusBadge(request.status)}`}>
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
                </span>
              </div>
            </div>

            {request.assignedHero && (
              <div className="mb-4 p-3 bg-snow-white rounded-lg border border-border-grey">
                <p className="text-sm text-grey-700 mb-1">Assigned to:</p>
                <p className="text-black font-semibold flex items-center gap-2">
                  <UserCheck size={16} className="text-christmas-red" />
                  {request.assignedHero.name} - ETA: {formatTime(request.eta)}
                </p>
              </div>
            )}

            {request.status === "waiting" && (
              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => getRecommendations(request._id)}
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                  disabled={loadingRecs}
                >
                  {expandedRequest === request._id ? (
                    <>
                      <ChevronUp size={20} />
                      Hide Hero Recommendations
                    </>
                  ) : (
                    <>
                      <ChevronDown size={20} />
                      Show Hero Recommendations
                    </>
                  )}
                </motion.button>

                <AnimatePresence>
                  {expandedRequest === request._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4"
                    >
                      {loadingRecs ? (
                        <p className="text-center text-grey-700 py-4">
                          Loading recommendations...
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          {recommendations.length === 0 ? (
                            <p className="text-center text-grey-700 py-4">
                              No recommendations available
                            </p>
                          ) : (
                            <table className="w-full text-sm">
                              <thead>
                                <tr>
                                  <th className="text-left py-2">Hero</th>
                                  <th className="text-left py-2">Score</th>
                                  <th className="text-left py-2">ETA</th>
                                  <th className="text-left py-2">Status</th>
                                  <th className="text-left py-2">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {recommendations.map((rec) => (
                                  <tr key={rec.heroId}>
                                    <td className="py-3 text-black font-semibold">
                                      {rec.name}
                                    </td>
                                    <td className="py-3 text-grey-900">
                                      {rec.score}
                                    </td>
                                    <td className="py-3 text-grey-900">
                                      {formatTime(rec.eta)}
                                    </td>
                                    <td className="py-3">
                                      <span
                                        className={
                                          rec.status === "Free"
                                            ? "text-christmas-red font-semibold"
                                            : "text-grey-600"
                                        }
                                      >
                                        {rec.status}
                                      </span>
                                    </td>
                                    <td className="py-3">
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() =>
                                          assignHero(request._id, rec.heroId)
                                        }
                                        disabled={assigning}
                                        className="btn btn-success text-xs px-3 py-1"
                                      >
                                        Assign
                                      </motion.button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        ))
      )}
    </div>
  );
}
