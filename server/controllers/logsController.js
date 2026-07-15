class LogsController {
  constructor(logsService) {
    this.logsService = logsService;
  }

  getLogs = async (req, res, next) => {
    try {
      const logs = await this.logsService.getAllLogs();
      res.json(logs);
    } catch (error) {
      next(error);
    }
  };

  addLog = async (req, res, next) => {
    try {
      // req.user is optional if authentication is disabled (fallback to admin user ID 1)
      const userId = req.user?.id || 1;
      const result = await this.logsService.addLog(userId, req.body);

      res.json({
        success: true,
        message: 'Log berhasil disimpan ke database!',
        logId: result.logId
      });
    } catch (error) {
      next(error);
    }
  };
}

import pool from '../config/db.js';
import LogsRepository from '../repositories/LogsRepository.js';
import LogsService from '../services/LogsService.js';

const logsRepository = new LogsRepository(pool);
const logsService = new LogsService(logsRepository);
const logsController = new LogsController(logsService);

export const getLogs = logsController.getLogs;
export const addLog = logsController.addLog;

export default LogsController;

