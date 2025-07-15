import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Movement from '../models/Movement.js';

dotenv.config();

const sampleCategories = [
  { name: 'Electrónicos', description: 'Productos electrónicos y tecnología', color: '#3B82F6' },
  { name: 'Ropa', description: 'Vestimenta y accesorios', color: '#EF4444' },
  { name: 'Hogar', description: 'Artículos para el hogar', color: '#10B981' },
  { name: 'Deportes', description: 'Equipamiento deportivo', color: '#F59E0B' },
  { name: 'Libros', description: 'Libros y material educativo', color: '#8B5CF6' }
];

const sampleProducts = [
  {
    name: 'Laptop HP Pavilion',
    category: 'Electrónicos',
    stock: 15,
    price: 899.99,
    minStock: 5,
    maxStock: 50,
    supplier: 'HP Inc.',
    sku: 'LAP-HP-001',
    description: 'Laptop de 15 pulgadas con procesador Intel i5'
  },
  {
    name: 'Smartphone Samsung Galaxy',
    category: 'Electrónicos',
    stock: 25,
    price: 699.99,
    minStock: 10,
    maxStock: 100,
    supplier: 'Samsung Electronics',
    sku: 'PHN-SAM-001',
    description: 'Smartphone Android con cámara de 48MP'
  },
  {
    name: 'Camiseta de Algodón',
    category: 'Ropa',
    stock: 100,
    price: 29.99,
    minStock: 20,
    maxStock: 200,
    supplier: 'TextilCorp',
    sku: 'CLT-CAM-001',
    description: 'Camiseta 100% algodón, talla M'
  },
  {
    name: 'Sofá de 3 Plazas',
    category: 'Hogar',
    stock: 8,
    price: 599.99,
    minStock: 2,
    maxStock: 20,
    supplier: 'MueblesPro',
    sku: 'HOM-SOF-001',
    description: 'Sofá moderno con tapizado de tela'
  },
  {
    name: 'Pelota de Fútbol',
    category: 'Deportes',
    stock: 30,
    price: 49.99,
    minStock: 10,
    maxStock: 80,
    supplier: 'DeportesMax',
    sku: 'SPT-PEL-001',
    description: 'Pelota oficial de fútbol profesional'
  },
  {
    name: 'Libro de Programación',
    category: 'Libros',
    stock: 3,
    price: 39.99,
    minStock: 5,
    maxStock: 30,
    supplier: 'EditorialTech',
    sku: 'BOK-PRG-001',
    description: 'Guía completa de JavaScript moderno'
  }
];

const seedData = async () => {
  try {
    console.log('🌱 Iniciando población de datos...');

    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔗 Conectado a MongoDB');

    // Limpiar datos existentes
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Movement.deleteMany({});
    console.log('🧹 Datos existentes eliminados');

    // Crear categorías
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log(`✅ ${createdCategories.length} categorías creadas`);

    // Crear productos
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ ${createdProducts.length} productos creados`);

    // Crear algunos movimientos de ejemplo
    const sampleMovements = [
      {
        productId: createdProducts[0]._id,
        productName: createdProducts[0].name,
        category: createdProducts[0].category,
        type: 'entrada',
        quantity: 20,
        previousStock: 0,
        newStock: 20,
        reason: 'Compra inicial',
        user: 'Admin',
        cost: 800.00
      },
      {
        productId: createdProducts[1]._id,
        productName: createdProducts[1].name,
        category: createdProducts[1].category,
        type: 'entrada',
        quantity: 30,
        previousStock: 0,
        newStock: 30,
        reason: 'Compra inicial',
        user: 'Admin',
        cost: 650.00
      },
      {
        productId: createdProducts[0]._id,
        productName: createdProducts[0].name,
        category: createdProducts[0].category,
        type: 'salida',
        quantity: 5,
        previousStock: 20,
        newStock: 15,
        reason: 'Venta',
        user: 'Vendedor1'
      }
    ];

    await Movement.insertMany(sampleMovements);
    console.log(`✅ ${sampleMovements.length} movimientos creados`);

    console.log('🎉 Población de datos completada exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   - Categorías: ${createdCategories.length}`);
    console.log(`   - Productos: ${createdProducts.length}`);
    console.log(`   - Movimientos: ${sampleMovements.length}`);

  } catch (error) {
    console.error('❌ Error durante la población de datos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Conexión cerrada');
    process.exit(0);
  }
};

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData();
}

export default seedData; 