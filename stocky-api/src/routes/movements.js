import express from 'express';
import {
  getMovements,
  getMovementById,
  createMovement,
  getMovementStats,
  getRecentMovements,
  getMovementsByProduct,
  getTopSellingProducts
} from '../controllers/movementController.js';

const router = express.Router();

// Rutas de movimientos
router.get('/top-selling', getTopSellingProducts);
router.get('/stats', getMovementStats);
router.get('/recent', getRecentMovements);
router.get('/product/:productId', getMovementsByProduct);
router.get('/:id', getMovementById);
router.get('/', getMovements);
router.post('/', createMovement);

export default router; 