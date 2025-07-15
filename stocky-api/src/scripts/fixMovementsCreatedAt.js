import mongoose from 'mongoose';
import Movement from '../models/Movement.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.DB_URI || 'mongodb://localhost:27017/stocky';

async function fixMovementsCreatedAt() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Conectado a MongoDB');

  // Buscar movimientos sin createdAt
  const movements = await Movement.find({ createdAt: { $exists: false } });
  console.log(`Movimientos sin createdAt: ${movements.length}`);

  for (const mov of movements) {
    // Usar la fecha actual o alguna otra lógica si se prefiere
    mov.createdAt = mov._id.getTimestamp ? mov._id.getTimestamp() : new Date();
    await mov.save();
    console.log(`Actualizado movimiento ${mov._id} con createdAt: ${mov.createdAt}`);
  }

  await mongoose.disconnect();
  console.log('Listo.');
}

fixMovementsCreatedAt().catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 