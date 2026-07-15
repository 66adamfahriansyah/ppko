import AppError from '../utils/AppError.js';

class LogsService {
  constructor(logsRepository) {
    this.logsRepository = logsRepository;
  }

  async getAllLogs() {
    const rows = await this.logsRepository.getAll();
    return rows.map(r => {
      let dateString = r.tanggal;
      if (r.tanggal instanceof Date) {
        dateString = r.tanggal.toISOString().split('T')[0];
      }
      return {
        id: r.id,
        user_id: r.user_id,
        creator: r.creator || 'Sistem',
        tanggal: dateString,
        lokasi: r.lokasi,
        hama: r.hama,
        pestisida: r.pestisida,
        catatan: r.catatan,
        created_at: r.created_at
      };
    });
  }

  async addLog(userId, logData) {
    const { tanggal, lokasi, hama, pestisida, catatan } = logData;

    if (!tanggal || !lokasi || !hama || !pestisida) {
      throw new AppError('Tanggal, lokasi, hama, dan pestisida wajib diisi', 400);
    }

    const cleanLogData = {
      tanggal,
      lokasi,
      hama,
      pestisida,
      catatan: catatan || '-'
    };

    const insertId = await this.logsRepository.create(userId, cleanLogData);
    if (!insertId) {
      throw new AppError('Gagal menyimpan log ke database', 500);
    }
    return { success: true, logId: insertId };
  }
}

export default LogsService;
