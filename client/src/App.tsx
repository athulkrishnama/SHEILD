import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ChildPortal from "./pages/ChildPortal";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="bg-gradient-to-r from-christmas-red to-hero-blue py-4 px-6 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-display font-bold text-white">
              🎅 S.H.I.E.L.D
            </h1>
            <div className="flex gap-4">
              <Link
                to="/"
                className="text-white hover:text-christmas-gold transition-colors font-semibold"
              >
                Gift Request
              </Link>
              <Link
                to="/dashboard"
                className="text-white hover:text-christmas-gold transition-colors font-semibold"
              >
                Control Room
              </Link>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<ChildPortal />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
