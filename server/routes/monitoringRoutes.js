import express from 'express';
import { getMonitoringData, updateControl, updateSensorData } from '../controllers/monitoringController.js';

const router = express.Router();

router.get('/', getMonitoringData);
router.post('/control', updateControl);
router.post('/update', updateSensorData);

export default router;
