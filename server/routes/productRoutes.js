import express from 'express';
import { 
  getPublicProducts, 
  getMyProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductDetails
} from '../controllers/ProductController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPublicProducts);

// Protected routes (Requires login - farmers or admins)
router.get('/my-products', authenticateToken, getMyProducts);
router.post('/', authenticateToken, createProduct);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

// Dynamic routes must be registered last
router.get('/:id', getProductDetails);



export default router;
