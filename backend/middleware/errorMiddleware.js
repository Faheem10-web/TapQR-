const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log console error for developers
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new Error(message);
    res.status(404);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for ${field} field. Please choose another one.`;
    error = new Error(message);
    res.status(400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = new Error(message);
    res.status(400);
  }

  res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = { errorHandler };
