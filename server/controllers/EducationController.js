import AppError from '../utils/AppError.js';
import pool from '../config/db.js';
import EducationRepository from '../repositories/EducationRepository.js';

class EducationController {
  constructor(educationRepository) {
    this.educationRepository = educationRepository;
  }

  getAllBooks = async (req, res, next) => {
    try {
      const books = await this.educationRepository.findAll();
      res.json(books);
    } catch (error) {
      next(error);
    }
  };

  createBook = async (req, res, next) => {
    try {
      if (req.user.role !== 'admin') {
        return next(new AppError('Akses ditolak: Hanya admin yang dapat menambahkan buku panduan', 403));
      }

      const { title, description, file_link, cover_image, type } = req.body;
      if (!title || !description || !file_link) {
        return next(new AppError('Judul, deskripsi, dan link file harus diisi', 400));
      }

      const book = await this.educationRepository.create({
        title,
        description,
        file_link,
        cover_image: cover_image || '',
        type: type || 'panduan'
      });

      res.json({
        success: true,
        message: 'Buku panduan berhasil ditambahkan!',
        book
      });
    } catch (error) {
      next(error);
    }
  };

  updateBook = async (req, res, next) => {
    try {
      if (req.user.role !== 'admin') {
        return next(new AppError('Akses ditolak: Hanya admin yang dapat mengubah buku panduan', 403));
      }

      const id = parseInt(req.params.id);
      const { title, description, file_link, cover_image, type } = req.body;
      if (!title || !description || !file_link) {
        return next(new AppError('Judul, deskripsi, dan link file harus diisi', 400));
      }

      const success = await this.educationRepository.update(id, {
        title,
        description,
        file_link,
        cover_image: cover_image || '',
        type: type || 'panduan'
      });

      if (!success) {
        return next(new AppError('Buku panduan tidak ditemukan', 404));
      }

      res.json({
        success: true,
        message: 'Buku panduan berhasil diperbarui!'
      });
    } catch (error) {
      next(error);
    }
  };

  deleteBook = async (req, res, next) => {
    try {
      if (req.user.role !== 'admin') {
        return next(new AppError('Akses ditolak: Hanya admin yang dapat menghapus buku panduan', 403));
      }

      const id = parseInt(req.params.id);
      const success = await this.educationRepository.delete(id);
      if (!success) {
        return next(new AppError('Buku panduan tidak ditemukan', 404));
      }

      res.json({
        success: true,
        message: 'Buku panduan berhasil dihapus!'
      });
    } catch (error) {
      next(error);
    }
  };
}

const educationRepository = new EducationRepository(pool);
const educationController = new EducationController(educationRepository);

export const getAllBooks = educationController.getAllBooks;
export const createBook = educationController.createBook;
export const updateBook = educationController.updateBook;
export const deleteBook = educationController.deleteBook;

export default EducationController;
