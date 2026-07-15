import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  getUnverifiedUsers, 
  verifyUser 
} from '../controllers/authController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Protected user route
router.get('/me', authenticateToken, getMe);

// Admin-only user verification routes
router.get('/unverified', authenticateToken, authorizeRole('admin'), getUnverifiedUsers);
router.post('/verify/:id', authenticateToken, authorizeRole('admin'), verifyUser);

export default router;

