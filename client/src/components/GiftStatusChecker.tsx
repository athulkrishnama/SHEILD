import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, User, RefreshCw } from "lucide-react";
import api from "../api/axios";

interface Request {
  _id: string;
  childName: string;
  city: string;
  gift: string;
  status: string;
  assignedHero?: {
    name: string;
  };
}

export default function GiftStatusChecker() {
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyRequest = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/requests/my-request");
      setRequest(response.data.request);
    } catch (err) {
      console.error("Error fetching request:", err);
      setError("Could not load your request status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequest();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="text-christmas-red" size={40} />;
      case "delivering":
        return <Truck className="text-christmas-red" size={40} />;
      case "assigned":
        return <Package className="text-christmas-red" size={40} />;
      default:
        return <Package className="text-grey-600" size={40} />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "completed":
        return "🎉 Your gift has been delivered!";
      case "delivering":
        return "🚀 Your gift is on the way!";
      case "assigned":
        return "📦 A hero has been assigned to your gift!";
      case "waiting":
        return "⏳ Waiting for a hero to be assigned...";
      default:
        return "Unknown status";
    }
  };

  if (loading) {
    return (
      <div className="card text-center py-12">
        <div className="text-4xl mb-4 animate-pulse-slow">🎁</div>
        <p className="text-grey-700">Loading your gift status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="p-4 bg-white border-l-4 border-christmas-red rounded-lg text-christmas-red-dark">
          {error}
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-bold text-black mb-2">No Request Found</h3>
        <p className="text-grey-700">
          You haven't submitted a gift request yet.
        </p>
        <p className="text-sm text-grey-600 mt-2">
          Submit a request above to track your gift!
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-4xl mb-2">🎁</div>
          <h2 className="text-2xl font-display font-bold text-black">
            Your Gift Status
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={fetchMyRequest}
          className="p-2 rounded-full hover:bg-snow-white transition-colors"
          title="Refresh status"
        >
          <RefreshCw size={20} className="text-christmas-red" />
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Status Card */}
        <div className="p-6 bg-snow-white rounded-lg border-2 border-border-grey text-center">
          <div className="mb-4">{getStatusIcon(request.status)}</div>
          <h3 className="text-xl font-bold text-black mb-2">
            {getStatusMessage(request.status)}
          </h3>
          <div
            className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
              request.status === "completed"
                ? "bg-christmas-red text-white"
                : "bg-grey-200 text-grey-800"
            }`}
          >
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </div>
        </div>

        {/* Gift Details */}
        <div className="p-4 bg-white rounded-lg border border-border-grey">
          <h4 className="font-semibold text-black mb-3">Gift Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-grey-700">Child Name:</span>
              <span className="font-semibold text-black">
                {request.childName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-grey-700">Requested Gift:</span>
              <span className="font-semibold text-black">{request.gift}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-grey-700">Delivery City:</span>
              <span className="font-semibold text-black">{request.city}</span>
            </div>
          </div>
        </div>

        {/* Hero Information - Only show when delivered */}
        {request.assignedHero && request.status === "completed" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-gradient-to-br from-christmas-red to-christmas-red-dark rounded-lg text-white text-center"
          >
            <User size={32} className="mx-auto mb-3" />
            <h4 className="font-bold text-lg mb-1">Delivered By</h4>
            <p className="text-2xl font-display font-bold">
              {request.assignedHero.name}
            </p>
            <p className="text-sm mt-2 opacity-90">
              Thank you for believing in the magic of Christmas! 🎄
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
