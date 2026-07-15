import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(username, namaLengkap, noTelp, asalPoktan, alamat, jenisKelamin, password) {
    if (!username || !namaLengkap || !noTelp || !asalPoktan || !alamat || !jenisKelamin || !password) {
      throw new AppError('Username, Nama Lengkap, Nomor Telefon, Asal Poktan, Alamat, Jenis Kelamin, dan Password wajib diisi', 400);
    }

    if (password.length < 6) {
      throw new AppError('Password harus minimal 6 karakter', 400);
    }

    // Generate a unique dummy email to satisfy DB email UNIQUE constraint
    const email = `${username.toLowerCase()}@ebio.com`;

    // Check duplication
    const existing = await this.userRepository.findByEmailOrUsername(email) ||
                     await this.userRepository.findByEmailOrUsername(username);

    if (existing) {
      throw new AppError('Username sudah terdaftar', 400);
    }

    // Hash password (bcrypt with 12 salt rounds for enhanced security)
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save
    return await this.userRepository.create(username, email, hashedPassword, namaLengkap, noTelp, asalPoktan, alamat, jenisKelamin);
  }



  async login(identity, password) {
    if (!identity || !password) {
      throw new AppError('Username/Email dan password wajib diisi', 400);
    }

    const user = await this.userRepository.findByEmailOrUsername(identity);
    // Generic error message to prevent username enumeration attacks (OWASP Auth Failure mitigation)
    if (!user) {
      throw new AppError('Username/Email atau password salah', 400);
    }

    if (user.is_active === 0) {
      throw new AppError('Akses ditolak: Akun Anda telah dinonaktifkan', 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Username/Email atau password salah', 400);
    }

    // Sign JWT
    const secret = process.env.JWT_SECRET || 'secret_fallback_key_32_chars_long';
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      secret,
      { expiresIn }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        nama_lengkap: user.nama_lengkap,
        no_telp: user.no_telp,
        asal_poktan: user.asal_poktan,
        alamat: user.alamat,
        jenis_kelamin: user.jenis_kelamin,
        is_verified: user.is_verified
      }
    };
  }

  async getUnverifiedUsers() {
    return await this.userRepository.findUnverified();
  }

  async verifyUser(id) {
    const success = await this.userRepository.verifyUser(id);
    if (!success) {
      throw new AppError('Pengguna tidak ditemukan atau gagal diverifikasi', 404);
    }
    return true;
  }

  async getCurrentUser(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('Pengguna tidak ditemukan', 404);
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      nama_lengkap: user.nama_lengkap,
      no_telp: user.no_telp,
      asal_poktan: user.asal_poktan,
      alamat: user.alamat,
      jenis_kelamin: user.jenis_kelamin,
      is_verified: user.is_verified
    };
  }
}


export default AuthService;
