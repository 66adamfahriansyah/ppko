class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  register = async (req, res, next) => {
    try {
      const { username, nama_lengkap, no_telp, asal_poktan, alamat, jenis_kelamin, password } = req.body;
      await this.authService.register(username, nama_lengkap, no_telp, asal_poktan, alamat, jenis_kelamin, password);
      res.json({ success: true, message: 'Registrasi berhasil!' });
    } catch (error) {
      next(error);
    }
  };



  login = async (req, res, next) => {
    try {
      const { identity, password } = req.body;
      const data = await this.authService.login(identity, password);
      res.json({
        success: true,
        token: data.token,
        user: data.user
      });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const user = await this.authService.getCurrentUser(userId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  getUnverifiedUsers = async (req, res, next) => {
    try {
      const users = await this.authService.getUnverifiedUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  verifyUser = async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      await this.authService.verifyUser(id);
      res.json({ success: true, message: 'Akun berhasil diverifikasi!' });
    } catch (error) {
      next(error);
    }
  };
}

import pool from '../config/db.js';
import UserRepository from '../repositories/UserRepository.js';
import AuthService from '../services/AuthService.js';

const userRepository = new UserRepository(pool);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

export const register = authController.register;
export const login = authController.login;
export const getMe = authController.getMe;
export const getUnverifiedUsers = authController.getUnverifiedUsers;
export const verifyUser = authController.verifyUser;

export default AuthController;


