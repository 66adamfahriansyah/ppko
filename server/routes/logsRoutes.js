import express from 'express';
import { getLogs, addLog } from '../controllers/logsController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getLogs);
router.post('/', addLog);


export default router;

