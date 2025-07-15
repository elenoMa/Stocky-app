import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  getLowStockProducts,
  updateStock
} from '../controllers/productController.js';

const router = express.Router();

// Rutas de productos
router.get('/stats', getProductStats);
router.get('/low-stock', getLowStockProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id/stock', updateStock);
router.get('/', getProducts);

export default router; 