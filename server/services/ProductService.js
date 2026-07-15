import AppError from '../utils/AppError.js';

class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async getAllPublicProducts() {
    return await this.productRepository.findAllActive();
  }

  async getProductsByUserId(userId) {
    return await this.productRepository.findByUserId(userId);
  }

  async getProductById(id) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError('Produk tidak ditemukan', 404);
    }
    return product;
  }

  async createProduct(productData) {
    const { name, description, address, contact, price } = productData;
    if (!name || !description || !address || !contact || !price) {
      throw new AppError('Nama produk, deskripsi, alamat, kontak, dan harga wajib diisi', 400);
    }
    return await this.productRepository.create(productData);
  }

  async updateProduct(id, userId, userRole, productData) {
    const { name, description, address, contact, price } = productData;
    if (!name || !description || !address || !contact || !price) {
      throw new AppError('Nama produk, deskripsi, alamat, kontak, dan harga wajib diisi', 400);
    }

    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new AppError('Produk tidak ditemukan', 404);
    }

    // Authorization: owner or admin
    if (existing.user_id !== userId && userRole !== 'admin') {
      throw new AppError('Akses ditolak: Anda bukan pemilik produk ini', 403);
    }

    return await this.productRepository.update(id, productData);
  }

  async deleteProduct(id, userId, userRole) {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new AppError('Produk tidak ditemukan', 404);
    }

    // Authorization: owner or admin
    if (existing.user_id !== userId && userRole !== 'admin') {
      throw new AppError('Akses ditolak: Anda bukan pemilik produk ini', 403);
    }

    return await this.productRepository.delete(id);
  }
}

export default ProductService;
