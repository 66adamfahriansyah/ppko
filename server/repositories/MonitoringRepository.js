class MonitoringRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async getAllSensorData() {
    const [
      [pltsRows],
      [rainRows],
      [lightTrapRows],
      [npkRows],
      [controlRows]
    ] = await Promise.all([
      this.pool.query('SELECT * FROM plts_monitoring WHERE id = 1'),
      this.pool.query('SELECT * FROM rain_monitoring WHERE id = 1'),
      this.pool.query('SELECT * FROM light_trap_monitoring WHERE id = 1'),
      this.pool.query('SELECT * FROM npk_monitoring WHERE id = 1'),
      this.pool.query('SELECT * FROM control_monitoring WHERE id = 1')
    ]);

    return {
      plts: pltsRows[0] || null,
      rain: rainRows[0] || null,
      lightTrap: lightTrapRows[0] || null,
      npk: npkRows[0] || null,
      control: controlRows[0] || null
    };
  }

  async updateControl(fields) {
    const updates = [];
    const values = [];

    if (fields.autoMode !== undefined) {
      updates.push('auto_mode = ?');
      values.push(fields.autoMode ? 1 : 0);
    }

    if (fields.manualActive !== undefined) {
      updates.push('manual_active = ?');
      values.push(fields.manualActive ? 1 : 0);
    }

    if (updates.length === 0) return false;

    const query = `UPDATE control_monitoring SET ${updates.join(', ')} WHERE id = 1`;
    const [result] = await this.pool.query(query, values);
    return result.affectedRows > 0;
  }

  async updateSensors(plts, rain, lightTrap, npk) {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      if (plts) {
        const { current, battery } = plts;
        await connection.query(
          'UPDATE plts_monitoring SET current = ?, battery = ? WHERE id = 1',
          [current, battery]
        );
      }

      if (rain) {
        const { status, detection, intensity } = rain;
        await connection.query(
          'UPDATE rain_monitoring SET status = ?, detection = ?, intensity = ? WHERE id = 1',
          [status, detection, intensity]
        );
      }

      if (lightTrap) {
        const { active, triggerMode, duration } = lightTrap;
        await connection.query(
          'UPDATE light_trap_monitoring SET active = ?, trigger_mode = ?, duration = ? WHERE id = 1',
          [active ? 1 : 0, triggerMode, duration]
        );
      }

      if (npk) {
        const { nitrogen, phosphor, potassium, status } = npk;
        await connection.query(
          'UPDATE npk_monitoring SET nitrogen = ?, phosphor = ?, potassium = ?, status = ? WHERE id = 1',
          [nitrogen, phosphor, potassium, status]
        );
      }

      const [controlRows] = await connection.query('SELECT * FROM control_monitoring WHERE id = 1');
      await connection.commit();
      return controlRows[0] || null;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getControlStatus() {
    const [rows] = await this.pool.query('SELECT * FROM control_monitoring WHERE id = 1');
    return rows[0] || null;
  }
}

export default MonitoringRepository;
