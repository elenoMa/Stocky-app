import express from 'express';
import {
  getMovements,
  getMovementById,
  createMovement,
  getMovementStats,
  getRecentMovements,
  getMovementsByProduct
} from '../controllers/movementController.js';

const router = express.Router();

// Rutas de movimientos
router.get('/', getMovements);
router.get('/stats', getMovementStats);
router.get('/recent', getRecentMovements);
router.get('/product/:productId', getMovementsByProduct);
router.get('/:id', getMovementById);
router.post('/', createMovement);

export default router; 