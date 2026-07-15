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

export default MonitoringController;
