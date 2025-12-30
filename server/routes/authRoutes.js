import express from "express";

const router = express.Router();

/**
 * POST /api/auth/login
 * Authenticate user with credentials from environment variables
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (username === adminUsername && password === adminPassword) {
    req.session.isAuthenticated = true;
    req.session.user = { username };

    return res.json({
      success: true,
      message: "Login successful",
      user: { username },
    });
  }

  return res.status(401).json({
    error: "Invalid credentials",
    message: "Username or password is incorrect",
  });
});

/**
 * POST /api/auth/logout
 * End user session
 */
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: "Logout failed",
        message: "Could not destroy session",
      });
    }

    res.clearCookie("connect.sid");
    return res.json({
      success: true,
      message: "Logout successful",
    });
  });
});

/**
 * GET /api/auth/check
 * Check if user is authenticated
 */
router.get("/check", (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    return res.json({
      authenticated: true,
      user: req.session.user,
    });
  }

  return res.json({
    authenticated: false,
  });
});

export default router;
