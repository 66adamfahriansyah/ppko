import AppError from '../utils/AppError.js';

class MonitoringService {
  constructor(monitoringRepository) {
    this.monitoringRepository = monitoringRepository;
  }

  async getData() {
    const raw = await this.monitoringRepository.getAllSensorData();

    const plts = raw.plts || { current: 0.0, battery: 0 };
    const rain = raw.rain || { status: '-', detection: '-', intensity: 0 };
    const lightTrap = raw.lightTrap || { active: 0, trigger_mode: '-', duration: 0 };
    const npk = raw.npk || { nitrogen: 0, phosphor: 0, potassium: 0, status: '-' };
    const control = raw.control || { auto_mode: 0, manual_active: 0 };

    return {
      plts: {
        current: parseFloat(plts.current),
        battery: parseInt(plts.battery)
      },
      rain: {
        status: rain.status,
        detection: rain.detection,
        intensity: parseInt(rain.intensity)
      },
      lightTrap: {
        active: lightTrap.active === 1,
        triggerMode: lightTrap.trigger_mode,
        duration: parseInt(lightTrap.duration)
      },
      npk: {
        nitrogen: parseInt(npk.nitrogen),
        phosphor: parseInt(npk.phosphor),
        potassium: parseInt(npk.potassium),
        status: npk.status
      },
      control: {
        autoMode: control.auto_mode === 1,
        manualActive: control.manual_active === 1
      }
    };
  }

  async updateControl(fields) {
    if (fields.autoMode === undefined && fields.manualActive === undefined) {
      throw new AppError('Tidak ada data kontrol yang disediakan untuk diperbarui', 400);
    }
    const success = await this.monitoringRepository.updateControl(fields);
    if (!success) {
      throw new AppError('Gagal memperbarui status kontrol di database', 500);
    }
    return true;
  }

  async updateSensors(sensorData) {
    const { plts, rain, lightTrap, npk } = sensorData;
    const latestControl = await this.monitoringRepository.updateSensors(plts, rain, lightTrap, npk);
    if (!latestControl) {
      throw new AppError('Gagal memperbarui data sensor', 500);
    }
    return {
      autoMode: latestControl.auto_mode === 1,
      manualActive: latestControl.manual_active === 1
    };
  }
}

export default MonitoringService;
