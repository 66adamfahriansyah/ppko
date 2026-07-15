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
      
      // Verification security constraint check and profile lookup
      const [userRows] = await pool.query('SELECT is_verified, role, alamat, no_telp FROM users WHERE id = ?', [userId]);
      if (!userRows[0] || (userRows[0].role !== 'admin' && userRows[0].is_verified !== 1)) {
        return next(new AppError('Akses ditolak: Akun Anda belum diverifikasi oleh admin', 403));
      }

      const { name, description, price, image } = req.body;
      const address = userRows[0].alamat || '-';
      const contact = userRows[0].no_telp || '-';

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

      // Query user profile details for updates
      const [userRows] = await pool.query('SELECT alamat, no_telp FROM users WHERE id = ?', [userId]);
      const address = userRows[0]?.alamat || '-';
      const contact = userRows[0]?.no_telp || '-';

      const { name, description, price, image, isActive } = req.body;
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

  getProductDetails = async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const product = await this.productService.getProductById(id);
      
      // Query owner profile details from database
      const [userRows] = await pool.query(
        'SELECT username, nama_lengkap, no_telp, asal_poktan, alamat FROM users WHERE id = ?', 
        [product.user_id]
      );
      const owner = userRows[0] || {};
      
      res.json({
        ...product,
        owner_username: owner.username || 'unknown',
        owner_name: owner.nama_lengkap || 'Petani Sajen',
        owner_phone: owner.no_telp || '-',
        owner_poktan: owner.asal_poktan || '-',
        owner_address: owner.alamat || '-'
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
export const getProductDetails = productController.getProductDetails;

export default ProductController;

