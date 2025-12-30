/**
 * Authentication Middleware
 * Checks if user is authenticated via session
 */

export const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }

  return res.status(401).json({
    error: "Unauthorized",
    message: "Please log in to access this resource",
  });
};

export default isAuthenticated;
