console.log('⏩ Importando mongoose...');
import mongoose from 'mongoose';
console.log('⏩ Importando dotenv...');
import dotenv from 'dotenv';
console.log('⏩ Importando Product...');
import Product from '../models/Product.js';
console.log('⏩ Importando Category...');
import Category from '../models/Category.js';
console.log('⏩ Importando Movement...');
import Movement from '../models/Movement.js';
console.log('⏩ Importando Supplier...');
import Supplier from '../models/Supplier.js';

dotenv.config();

console.log('🔎 process.env.MONGO_URI:', process.env.MONGO_URI);

const sampleCategories = [
  { name: 'Electrónicos', description: 'Productos electrónicos y tecnología', color: '#3B82F6' },
  { name: 'Ropa', description: 'Vestimenta y accesorios', color: '#EF4444' },
  { name: 'Hogar', description: 'Artículos para el hogar', color: '#10B981' },
  { name: 'Deportes', description: 'Equipamiento deportivo', color: '#F59E0B' },
  { name: 'Libros', description: 'Libros y material educativo', color: '#8B5CF6' }
];

const sampleSuppliers = [
  {
    name: 'HP Inc.',
    email: 'contacto@hp.com',
    phone: '+1 800-123-4567',
    address: '1501 Page Mill Rd, Palo Alto, CA',
    contactPerson: 'Ana Martínez',
    notes: 'Proveedor principal de laptops',
    active: true
  },
  {
    name: 'Samsung Electronics',
    email: 'ventas@samsung.com',
    phone: '+82 2-2255-0114',
    address: '129 Samsung-ro, Suwon-si, Corea',
    contactPerson: 'Jin Park',
    notes: 'Proveedor de smartphones',
    active: true
  },
  {
    name: 'TextilCorp',
    email: 'info@textilcorp.com',
    phone: '+54 11 5555-1234',
    address: 'Av. Siempre Viva 123, Buenos Aires',
    contactPerson: 'Lucía Gómez',
    notes: '',
    active: true
  },
  {
    name: 'MueblesPro',
    email: 'ventas@mueblespro.com',
    phone: '+34 91 123 4567',
    address: 'Calle Falsa 456, Madrid',
    contactPerson: 'Carlos Ruiz',
    notes: 'Proveedor de muebles',
    active: false
  },
  {
    name: 'DeportesMax',
    email: 'contacto@deportesmax.com',
    phone: '+34 93 987 6543',
    address: 'Carrer Esport 10, Barcelona',
    contactPerson: 'Marta Serra',
    notes: '',
    active: true
  },
  {
    name: 'EditorialTech',
    email: 'editorial@tech.com',
    phone: '+34 91 222 3333',
    address: 'Calle Libros 789, Madrid',
    contactPerson: 'Pedro López',
    notes: 'Editorial de libros técnicos',
    active: true
  }
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
    console.log('🔗 Intentando conectar a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos existentes
    console.log('🧹 Eliminando categorías existentes...');
    await Category.deleteMany({});
    console.log('🧹 Eliminando proveedores existentes...');
    await Supplier.deleteMany({});
    console.log('🧹 Eliminando productos existentes...');
    await Product.deleteMany({});
    console.log('🧹 Eliminando movimientos existentes...');
    await Movement.deleteMany({});
    console.log('🧹 Datos existentes eliminados');

    // Crear categorías y obtener el mapping nombre -> _id
    console.log('📦 Insertando categorías...');
    const createdCategories = await Category.insertMany(sampleCategories);
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });
    console.log(`✅ ${createdCategories.length} categorías creadas`);

    // Crear proveedores
    console.log('📦 Insertando proveedores...');
    const createdSuppliers = await Supplier.insertMany(sampleSuppliers);
    const supplierMap = {};
    createdSuppliers.forEach(sup => {
      supplierMap[sup.name] = sup._id;
    });
    console.log(`✅ ${createdSuppliers.length} proveedores creados`);

    // Crear productos usando el _id de la categoría y el _id del proveedor
    console.log('📦 Insertando productos...');
    const productsToInsert = sampleProducts.map(prod => ({
      ...prod,
      category: categoryMap[prod.category],
      supplier: supplierMap[prod.supplier] || undefined
    }));
    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`✅ ${createdProducts.length} productos creados`);

    // Crear algunos movimientos de ejemplo
    console.log('📦 Insertando movimientos...');
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
    if (error && error.stack) {
      console.error(error.stack);
    }
  } finally {
    await mongoose.connection.close();
    console.log('👋 Conexión cerrada');
    process.exit(0);
  }
};

seedData();

export default seedData; 