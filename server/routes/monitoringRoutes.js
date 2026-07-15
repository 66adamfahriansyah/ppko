import express from 'express';
import { getMonitoringData, updateControl, updateSensorData } from '../controllers/monitoringController.js';
import { authenticateToken, authorizeRole, authenticateApiKey } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMonitoringData);
router.post('/control', updateControl);
router.post('/update', authenticateApiKey, updateSensorData);


export default router;

