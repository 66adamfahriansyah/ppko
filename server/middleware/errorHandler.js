import AppError from '../utils/AppError.js';

function errorHandler(err, req, res, next) {
  // If it's a known operational error, send the message to the client
  if (err instanceof AppError || err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // If it's a library/system bug or db error, log it and return generic message (Confidentiality)
  console.error('❌ [Unexpected Error]:', err);
  res.status(500).json({ error: 'Terjadi kesalahan internal pada server' });
}

export default errorHandler;
