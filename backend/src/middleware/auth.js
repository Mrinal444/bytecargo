const jwt = require("jsonwebtoken");
const createHttpError = require("../utils/httpError");

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return next(createHttpError(401, "No token provided"));
  }

  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(createHttpError(401, "Invalid authorization header"));
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return next(createHttpError(401, "Invalid token"));
  }
};