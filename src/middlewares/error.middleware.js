export const errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({ status: "error", message: err.message });
  }
  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";
  return res.status(statusCode).json({ status: "error", message });
};
