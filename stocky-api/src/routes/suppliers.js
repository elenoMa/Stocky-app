import express from 'express';
import supplierController from '../controllers/supplierController.js';
import auth from '../middlewares/authMiddleware.js';
import admin from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Listar proveedores (autenticado)
router.get('/', auth, supplierController.getSuppliers);
// Crear proveedor (solo admin)
router.post('/', auth, admin, supplierController.createSupplier);
// Obtener proveedor por id (autenticado)
router.get('/:id', auth, supplierController.getSupplierById);
// Editar proveedor (solo admin)
router.put('/:id', auth, admin, supplierController.updateSupplier);
// Eliminar proveedor (solo admin, soft delete)
router.delete('/:id', auth, admin, supplierController.deleteSupplier);

export default router; 