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
      // req.user comes from authenticateToken middleware (OWASP Security audit requirement)
      const userId = req.user.id;
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

export default LogsController;
