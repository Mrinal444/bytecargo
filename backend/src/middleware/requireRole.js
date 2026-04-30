const createHttpError = require("../utils/httpError");

module.exports = function requireRole(...allowedRoles) {
  return function roleGuard(req, res, next) {
    if (!req.user) {
      return next(createHttpError(401, "Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(createHttpError(403, "You do not have permission to access this resource"));
    }

    return next();
  };
};