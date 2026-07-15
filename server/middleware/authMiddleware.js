import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('Akses ditolak: Token tidak ditemukan', 401));
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret_fallback_key_32_chars_long', (err, user) => {
    if (err) {
      return next(new AppError('Akses ditolak: Token tidak valid atau kadaluwarsa', 401));
    }
    req.user = user;
    next();
  });
}

export function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError('Akses ditolak: Hak akses tidak mencukupi', 403));
    }
    next();
  };
}

// Special IoT API Key checking middleware for ESP32 controller
export function authenticateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  const serverApiKey = process.env.ESP_API_KEY || 'default_esp_key';

  if (!apiKey || apiKey !== serverApiKey) {
    return next(new AppError('Akses ditolak: API Key tidak valid', 401));
  }
  next();
}
