
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user?.roles[0];
  
      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    };
  };
  