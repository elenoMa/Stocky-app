// app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/database.js';
import { authMiddleware } from './src/middlewares/authMiddleware.js';

// Importar rutas
import productRoutes from './src/routes/products.js';
import movementRoutes from './src/routes/movements.js';
import categoryRoutes from './src/routes/categories.js';
import authRoutes from './src/routes/auth.js';
import usersRoutes from './src/routes/users.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
connectDB();

// Rutas básicas de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'Stocky API is running ✅' });
});

// Rutas de la API
app.use('/api/products', authMiddleware, productRoutes);
app.use('/api/movements', authMiddleware, movementRoutes);
app.use('/api/categories', authMiddleware, categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!', error: err.message });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);
});
