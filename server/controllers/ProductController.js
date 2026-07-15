import AppError from '../utils/AppError.js';

class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  getPublicProducts = async (req, res, next) => {
    try {
      const products = await this.productService.getAllPublicProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  };

  getMyProducts = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const products = await this.productService.getProductsByUserId(userId);
      res.json(products);
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      // Verification security constraint check
      const [userRows] = await pool.query('SELECT is_verified, role FROM users WHERE id = ?', [userId]);
      if (!userRows[0] || (userRows[0].role !== 'admin' && userRows[0].is_verified !== 1)) {
        return next(new AppError('Akses ditolak: Akun Anda belum diverifikasi oleh admin', 403));
      }

      const { name, description, address, contact, price, image } = req.body;
      const product = await this.productService.createProduct({
        userId,
        name,
        description,
        address,
        contact,
        price,
        image
      });

      res.json({
        success: true,
        message: 'Produk berhasil ditambahkan ke toko!',
        product
      });
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.id;
      const userRole = req.user.role;
      const { name, description, address, contact, price, image, isActive } = req.body;
      await this.productService.updateProduct(id, userId, userRole, {
        name,
        description,
        address,
        contact,
        price,
        image,
        isActive
      });
      res.json({
        success: true,
        message: 'Produk berhasil diperbarui!'
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.id;
      const userRole = req.user.role;
      await this.productService.deleteProduct(id, userId, userRole);
      res.json({
        success: true,
        message: 'Produk berhasil dihapus dari toko!'
      });
    } catch (error) {
      next(error);
    }
  };
}

import pool from '../config/db.js';
import ProductRepository from '../repositories/ProductRepository.js';
import ProductService from '../services/ProductService.js';

const productRepository = new ProductRepository(pool);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

export const getPublicProducts = productController.getPublicProducts;
export const getMyProducts = productController.getMyProducts;
export const createProduct = productController.createProduct;
export const updateProduct = productController.updateProduct;
export const deleteProduct = productController.deleteProduct;

export default ProductController;
