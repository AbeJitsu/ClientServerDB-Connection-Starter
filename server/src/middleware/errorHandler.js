const errorHandler = (err, req, res, next) => {
  // Log the error
  console.error('Error:', err);

  // Set default values
  let status = err.status || 500;
  let message = err.message || 'An unexpected error occurred';
  let errorCode = err.code || 'INTERNAL_SERVER_ERROR';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    errorCode = 'VALIDATION_ERROR';
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format';
    errorCode = 'INVALID_ID';
  } else if (err.code === 11000) {
    status = 409;
    message = 'Duplicate key error';
    errorCode = 'DUPLICATE_KEY';
  }

  // Prepare the error response
  const errorResponse = {
    status: 'error',
    errorCode,
    message,
    timestamp: new Date().toISOString(),
  };

  // Include stack trace in development environment
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Include the original error message in development environment
  if (process.env.NODE_ENV === 'development' && err.message !== message) {
    errorResponse.originalError = err.message;
  }

  // Send the error response
  res.status(status).json(errorResponse);
};

module.exports = errorHandler;
