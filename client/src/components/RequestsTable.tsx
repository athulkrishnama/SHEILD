import { useState } from "react";
import axios from "axios";
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
      console.log("Recommendations response:", response.data);
      console.log("Recommendations array:", response.data.recommendations);
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      alert("Failed to load recommendations. Check console for details.");
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-900/50 text-yellow-300";
      case "assigned":
        return "bg-blue-900/50 text-blue-300";
      case "delivering":
        return "bg-purple-900/50 text-purple-300";
      case "completed":
        return "bg-green-900/50 text-green-300";
      default:
        return "bg-gray-900/50 text-gray-300";
    }
  };

  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl text-gray-400">No gift requests yet</p>
        </div>
      ) : (
        requests.map((request) => (
          <div key={request._id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {request.childName} - {request.city}
                </h3>
                <p className="text-gray-300">
                  🎁 {request.gift}{" "}
                  <span className="text-gray-500">(₹{request.giftPrice})</span>
                </p>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    request.status
                  )}`}
                >
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
                </span>
              </div>
            </div>

            {request.assignedHero && (
              <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-gray-400">Assigned to:</p>
                <p className="text-white font-semibold">
                  {request.assignedHero.name} - ETA: {formatTime(request.eta)}
                </p>
              </div>
            )}

            {request.status === "waiting" && (
              <div>
                <button
                  onClick={() => getRecommendations(request._id)}
                  className="btn btn-primary w-full"
                  disabled={loadingRecs}
                >
                  {expandedRequest === request._id ? "Hide" : "Show"} Hero
                  Recommendations
                </button>

                {expandedRequest === request._id && (
                  <div className="mt-4 space-y-2">
                    {loadingRecs ? (
                      <p className="text-center text-gray-400">
                        Loading recommendations...
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        {recommendations.length === 0 ? (
                          <p className="text-center text-gray-400 py-4">
                            No recommendations available. Check server logs.
                          </p>
                        ) : (
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-2 text-gray-400">
                                  Hero
                                </th>
                                <th className="text-left py-2 text-gray-400">
                                  Score
                                </th>
                                <th className="text-left py-2 text-gray-400">
                                  ETA
                                </th>
                                <th className="text-left py-2 text-gray-400">
                                  Status
                                </th>
                                <th className="text-left py-2 text-gray-400">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {recommendations.map((rec) => (
                                <tr
                                  key={rec.heroId}
                                  className="border-b border-gray-800"
                                >
                                  <td className="py-3 text-white font-semibold">
                                    {rec.name}
                                  </td>
                                  <td className="py-3 text-white">
                                    {rec.score}
                                  </td>
                                  <td className="py-3 text-white">
                                    {formatTime(rec.eta)}
                                  </td>
                                  <td className="py-3">
                                    <span
                                      className={
                                        rec.status === "Free"
                                          ? "text-green-400"
                                          : "text-red-400"
                                      }
                                    >
                                      {rec.status}
                                    </span>
                                  </td>
                                  <td className="py-3">
                                    <button
                                      onClick={() =>
                                        assignHero(request._id, rec.heroId)
                                      }
                                      disabled={assigning}
                                      className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition-colors"
                                    >
                                      Assign
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
