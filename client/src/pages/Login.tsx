import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User, AlertCircle } from "lucide-react";
import axios from "axios";
import { SnowOverlay } from "../components/decorations/ChristmasDecor";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "/api/auth/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Hero Red Section */}
      <div className="fixed top-0 left-0 right-0 hero-red">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            🎅 S.H.I.E.L.D Control Panel
          </h1>
          <p className="text-white/90">Secure Admin Access</p>
        </div>
        <SnowOverlay />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card max-w-md w-full mx-4 mt-32"
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔐</div>
          <h2 className="text-2xl font-display font-bold text-black mb-1">
            Admin Login
          </h2>
          <p className="text-grey-700">
            Enter your credentials to access the control panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-grey-800 flex items-center gap-2">
              <User size={16} className="text-christmas-red" />
              Username
            </label>
            <input
              type="text"
              required
              className="input"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-grey-800 flex items-center gap-2">
              <Lock size={16} className="text-christmas-red" />
              Password
            </label>
            <input
              type="password"
              required
              className="input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-white border-l-4 border-christmas-red rounded-lg flex items-center gap-2 text-christmas-red-dark"
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full text-lg py-3"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-pulse-slow">🔓</span>
                Authenticating...
              </span>
            ) : (
              "🎄 Login"
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-grey-700">
            Default credentials are set in server environment variables
          </p>
        </div>
      </motion.div>
    </div>
  );
}
