import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './services/dbInit.js';
import authRoutes from './routes/authRoutes.js';
import monitoringRoutes from './routes/monitoringRoutes.js';
import logsRoutes from './routes/logsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Inisialisasi Database
initializeDatabase();

// Routing
app.use('/api/auth', authRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/logs', logsRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server backend berjalan di http://localhost:${PORT}`);
});
