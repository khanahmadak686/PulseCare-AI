const AppError = require("../errors/AppError");

// =============================
// Route Not Found
// =============================
const notFound = (req, res, next) => {
  const error = new AppError(
    `Route Not Found - ${req.originalUrl}`,
    404
  );

  next(error);
};

// =============================
// Global Error Handler
// =============================
const errorHandler = (
  err,
  req,
  res,
  next
) => {

  let statusCode = err.statusCode || 500;

  let message =
    err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,

    message,

    stack:
      process.env.NODE_ENV === "production"
        ? null
        : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};