import Supplier from '../models/Supplier.js';

const supplierController = {
  // Listar proveedores
  async getSuppliers(req, res) {
    try {
      const suppliers = await Supplier.find();
      res.json({ suppliers });
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener proveedores' });
    }
  },

  // Crear proveedor
  async createSupplier(req, res) {
    try {
      const supplier = new Supplier(req.body);
      await supplier.save();
      res.status(201).json({ supplier });
    } catch (err) {
      res.status(400).json({ message: 'Error al crear proveedor', error: err.message });
    }
  },

  // Obtener proveedor por ID
  async getSupplierById(req, res) {
    try {
      const supplier = await Supplier.findById(req.params.id);
      if (!supplier) return res.status(404).json({ message: 'Proveedor no encontrado' });
      res.json({ supplier });
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener proveedor' });
    }
  },

  // Editar proveedor
  async updateSupplier(req, res) {
    try {
      const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!supplier) return res.status(404).json({ message: 'Proveedor no encontrado' });
      res.json({ supplier });
    } catch (err) {
      res.status(400).json({ message: 'Error al editar proveedor', error: err.message });
    }
  },

  // Eliminar proveedor (soft delete)
  async deleteSupplier(req, res) {
    try {
      const supplier = await Supplier.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
      if (!supplier) return res.status(404).json({ message: 'Proveedor no encontrado' });
      res.json({ message: 'Proveedor eliminado', supplier });
    } catch (err) {
      res.status(500).json({ message: 'Error al eliminar proveedor' });
    }
  }
};

export default supplierController; 