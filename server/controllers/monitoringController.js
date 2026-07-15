class MonitoringController {
  constructor(monitoringService) {
    this.monitoringService = monitoringService;
  }

  getMonitoringData = async (req, res, next) => {
    try {
      const data = await this.monitoringService.getData();
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  updateControl = async (req, res, next) => {
    try {
      const { autoMode, manualActive } = req.body;
      await this.monitoringService.updateControl({ autoMode, manualActive });
      res.json({ success: true, message: 'Status kontrol berhasil diperbarui' });
    } catch (error) {
      next(error);
    }
  };

  updateSensorData = async (req, res, next) => {
    try {
      const { plts, rain, lightTrap, npk } = req.body;
      const controlResponse = await this.monitoringService.updateSensors({ plts, rain, lightTrap, npk });
      res.json({
        success: true,
        message: 'Data sensor berhasil diperbarui',
        control: controlResponse
      });
    } catch (error) {
      next(error);
    }
  };
}

import pool from '../config/db.js';
import MonitoringRepository from '../repositories/MonitoringRepository.js';
import MonitoringService from '../services/MonitoringService.js';

const monitoringRepository = new MonitoringRepository(pool);
const monitoringService = new MonitoringService(monitoringRepository);
const monitoringController = new MonitoringController(monitoringService);

export const getMonitoringData = monitoringController.getMonitoringData;
export const updateControl = monitoringController.updateControl;
export const updateSensorData = monitoringController.updateSensorData;

export default MonitoringController;

