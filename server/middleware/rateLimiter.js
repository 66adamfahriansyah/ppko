import rateLimit from 'express-rate-limit';

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 mins default
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

export const globalLimiter = rateLimit({
  windowMs,
  max: maxRequests,
  message: { error: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 login/register requests per windowMs
  message: { error: 'Terlalu banyak percobaan autentikasi, silakan coba lagi dalam 15 menit' },
  standardHeaders: true,
  legacyHeaders: false,
});
