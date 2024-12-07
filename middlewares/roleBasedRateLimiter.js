import rateLimit from 'express-rate-limit';
import roleLimits from './rateLimits.js'; // Import role-based configuration

export const roleBasedRateLimiter = (req, res, next) => {
  const userRole = req.user?.roles?.[0]?.toLowerCase(); // Get user role in lowercase

  if (!userRole || !roleLimits[userRole]) {
    return res.status(403).json({ message: 'Access denied or invalid role.' });
  }

  const { windowMs, maxRequests, message } = roleLimits[userRole];

  // Create a rate limiter for the specific role
  const limiter = rateLimit({
    windowMs,
    max: maxRequests,
    message: message || `Rate limit exceeded for ${userRole}. Please try again later.`,
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Pass the request through the role-specific limiter
  return limiter(req, res, next);
};

