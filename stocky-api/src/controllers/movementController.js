import Movement from '../models/Movement.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

// Obtener todos los movimientos
export const getMovements = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, category, productId, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Construir filtros
    const filters = {};
    if (type) filters.type = type;
    if (category) filters.category = category;
    if (productId) filters.productId = productId;
    
    // Filtro por fechas
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }

    // Construir ordenamiento
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;
    
    const movements = await Movement.find(filters)
      .populate('productId', 'name sku')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Movement.countDocuments(filters);

    // Log de los movimientos para depuración
    console.log('Movements encontrados:', JSON.stringify(movements, null, 2));

    res.json({
      movements,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error en getMovements:', error);
    res.status(500).json({ message: 'Error al obtener movimientos', error: error.message });
  }
};

// Obtener un movimiento por ID
export const getMovementById = async (req, res) => {
  try {
    const movement = await Movement.findById(req.params.id).populate('productId', 'name sku');
    if (!movement) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }
    res.json(movement);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener movimiento', error: error.message });
  }
};

// Crear un nuevo movimiento
export const createMovement = async (req, res) => {
  try {
    const { productId, type, quantity, reason, user, cost, notes } = req.body;

    // Verificar que el producto existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Buscar el nombre de la categoría manualmente
    let categoryName = product.category;
    if (product.category) {
      const categoryDoc = await Category.findById(product.category);
      if (categoryDoc) {
        categoryName = categoryDoc.name;
      }
    }

    const previousStock = product.stock;
    let newStock;

    // Calcular nuevo stock
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

    // Crear el movimiento
    const movement = new Movement({
      productId,
      productName: product.name,
      category: categoryName,
      type,
      quantity,
      previousStock,
      newStock,
      reason,
      user,
      cost,
      notes
    });

    await movement.save();

    // Actualizar el stock del producto
    product.stock = newStock;
    await product.save();

    // Poblar la información del producto en la respuesta
    await movement.populate('productId', 'name sku');

    res.status(201).json(movement);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear movimiento', error: error.message });
  }
};

// Obtener estadísticas de movimientos
export const getMovementStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filters = {};
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }

    const [
      totalMovements,
      entradas,
      salidas,
      totalEntradas,
      totalSalidas,
      valorTotal
    ] = await Promise.all([
      Movement.countDocuments(filters),
      Movement.countDocuments({ ...filters, type: 'entrada' }),
      Movement.countDocuments({ ...filters, type: 'salida' }),
      Movement.aggregate([
        { $match: { ...filters, type: 'entrada' } },
        { $group: { _id: null, total: { $sum: '$quantity' } } }
      ]),
      Movement.aggregate([
        { $match: { ...filters, type: 'salida' } },
        { $group: { _id: null, total: { $sum: '$quantity' } } }
      ]),
      Movement.aggregate([
        { $match: { ...filters, cost: { $exists: true, $ne: null } } },
        { $group: { _id: null, total: { $sum: { $multiply: ['$quantity', '$cost'] } } } }
      ])
    ]);

    res.json({
      totalMovements,
      entradas,
      salidas,
      totalEntradas: totalEntradas[0]?.total || 0,
      totalSalidas: totalSalidas[0]?.total || 0,
      valorTotal: valorTotal[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};

// Obtener movimientos recientes
export const getRecentMovements = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const movements = await Movement.find()
      .populate('productId', 'name sku')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener movimientos recientes', error: error.message });
  }
};

// Obtener movimientos por producto
export const getMovementsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (page - 1) * limit;
    
    const movements = await Movement.find({ productId })
      .populate('productId', 'name sku')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Movement.countDocuments({ productId });

    res.json({
      movements,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener movimientos del producto', error: error.message });
  }
};

// Obtener productos más vendidos
export const getTopSellingProducts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    console.log('[getTopSellingProducts] limit:', limit);
    const topProducts = await Movement.aggregate([
      { $match: { type: 'salida' } },
      { $group: {
          _id: '$productId',
          productName: { $first: '$productName' },
          category: { $first: '$category' },
          totalSales: { $sum: '$quantity' }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: parseInt(limit) },
    ]);
    console.log('[getTopSellingProducts] topProducts:', topProducts);
    res.json(topProducts);
  } catch (error) {
    console.error('[getTopSellingProducts] ERROR:', error);
    res.status(500).json({ message: 'Error al obtener productos más vendidos', error: error.message, stack: error.stack });
  }
}; 