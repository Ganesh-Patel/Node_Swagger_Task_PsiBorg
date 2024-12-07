
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.roles[0]?.toLowerCase();

      if (
        !userRole || 
        !allowedRoles.map(role => role.toLowerCase()).includes(userRole)
      ) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: "Error in role authorization", error: error.message });
    }
  };
};

  