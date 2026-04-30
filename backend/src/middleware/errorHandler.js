module.exports = function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.code === "P2002") {
    return res.status(409).json({
      error: "A record with these values already exists",
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      error: "Record not found",
    });
  }

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    error: err.message || "Internal server error",
  });
};