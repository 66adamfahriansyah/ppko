import express from 'express';
import { 
  getAllBooks, 
  createBook, 
  updateBook, 
  deleteBook 
} from '../controllers/EducationController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.get('/', authenticateToken, getAllBooks);
router.post('/', authenticateToken, createBook);
router.put('/:id', authenticateToken, updateBook);
router.delete('/:id', authenticateToken, deleteBook);

export default router;
