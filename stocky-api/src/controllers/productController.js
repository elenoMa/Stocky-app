import Product from '../models/Product.js';
import Supplier from '../models/Supplier.js';

// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, status, sortBy = 'name', sortOrder = 'asc' } = req.query;
    
    // Construir filtros
    const filters = {};
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) filters.category = category;
    if (status) filters.status = status;

    // Construir ordenamiento
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;
    
    const products = await Product.find(filters)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('supplier');

    const total = await Product.countDocuments(filters);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('supplier');
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener producto', error: error.message });
  }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
  try {
    // Validar supplier si se envía
    if (req.body.supplier) {
      const exists = await Supplier.findById(req.body.supplier);
      if (!exists) {
        return res.status(400).json({ message: 'Proveedor no válido' });
      }
    }
    const product = new Product(req.body);
    await product.save();
    await product.populate('supplier');
    res.status(201).json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'El SKU ya existe' });
    }
    res.status(500).json({ message: 'Error al crear producto', error: error.message });
  }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
  try {
    // Validar supplier si se envía
    if (req.body.supplier) {
      const exists = await Supplier.findById(req.body.supplier);
      if (!exists) {
        return res.status(400).json({ message: 'Proveedor no válido' });
      }
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('supplier');
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'El SKU ya existe' });
    }
    res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};

// Obtener estadísticas de productos
export const getProductStats = async (req, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalValue,
      averagePrice,
      totalStock
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Product.countDocuments({ status: 'low-stock' }),
      Product.aggregate([
        { $group: { _id: null, total: { $sum: { $multiply: ['$stock', '$price'] } } } }
      ]),
      Product.aggregate([
        { $group: { _id: null, avg: { $avg: '$price' } } }
      ]),
      Product.aggregate([
        { $group: { _id: null, total: { $sum: '$stock' } } }
      ])
    ]);

    res.json({
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalValue: totalValue[0]?.total || 0,
      averagePrice: averagePrice[0]?.avg || 0,
      totalStock: totalStock[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};

// Obtener productos con bajo stock
export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: 'low-stock' }).sort({ stock: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos con bajo stock', error: error.message });
  }
};

// Actualizar stock de un producto
export const updateStock = async (req, res) => {
  try {
    const { quantity, type } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const previousStock = product.stock;
    let newStock;

    if (type === 'entrada') {
      newStock = previousStock + quantity;
    } else if (type === 'salida') {
      if (previousStock < quantity) {
        return res.status(400).json({ message: 'Stock insuficiente' });
      }
      newStock = previousStock - quantity;
    } else {
      return res.status(400).json({ message: 'Tipo de movimiento inválido' });
    }

    product.stock = newStock;
    await product.save();

    res.json({
      product,
      previousStock,
      newStock,
      movement: { type, quantity }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar stock', error: error.message });
  }
}; 