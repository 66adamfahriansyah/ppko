class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  register = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      await this.authService.register(username, email, password);
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
}

import pool from '../config/db.js';
import UserRepository from '../repositories/UserRepository.js';
import AuthService from '../services/AuthService.js';

const userRepository = new UserRepository(pool);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

export const register = authController.register;
export const login = authController.login;

export default AuthController;

