import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Snowfall from "react-snowfall";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import ChildPortal from "./pages/ChildPortal";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      {/* Elegant Snowfall - Reduced count for professional feel */}
      <Snowfall
        color="#ffffff"
        snowflakeCount={100}
        speed={[0.5, 1.0]}
        wind={[-0.5, 0.5]}
        radius={[0.5, 2.0]}
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 1000,
          pointerEvents: "none",
          opacity: 0.6,
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Premium Christmas Navigation */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-christmas-red shadow-christmas relative z-10"
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Logo with Christmas styling */}
              <motion.h1
                whileHover={{ scale: 1.02 }}
                className="text-2xl font-display font-bold text-white flex items-center gap-2"
              >
                <span className="text-3xl">🎅</span>
                S.H.I.E.L.D
                <span className="text-2xl">🎄</span>
              </motion.h1>

              {/* Navigation Links */}
              <div className="flex items-center gap-6">
                <Link
                  to="/"
                  className="text-white hover:text-white/90 transition-all font-semibold flex items-center gap-2 hover:scale-105 duration-200"
                >
                  🎁 Gift Request
                </Link>
                <Link
                  to="/dashboard"
                  className="text-white hover:text-white/90 transition-all font-semibold flex items-center gap-2 hover:scale-105 duration-200"
                >
                  ❄️ Control Room
                </Link>

                {/* Bell Icon for notifications */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white hover:text-white/90 transition-all p-2 rounded-full hover:bg-white/10"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Snow overlay at bottom of nav */}
          <svg
            className="absolute bottom-0 left-0 right-0 w-full pointer-events-none"
            style={{ height: "20px", transform: "translateY(100%)" }}
            viewBox="0 0 1200 20"
            preserveAspectRatio="none"
          >
            <path
              d="M0 10 Q50 0 100 10 T200 10 T300 10 T400 10 T500 10 T600 10 T700 10 T800 10 T900 10 T1000 10 T1200 10 L1200 20 L0 20 Z"
              fill="white"
            />
          </svg>
        </motion.nav>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Routes>
            <Route path="/" element={<ChildPortal />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </motion.div>
      </div>
    </Router>
  );
}

export default App;
