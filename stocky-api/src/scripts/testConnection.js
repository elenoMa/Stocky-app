import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔎 process.env.MONGO_URI:', process.env.MONGO_URI);

const test = async () => {
  try {
    console.log('🔗 Intentando conectar a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Conexión cerrada');
    process.exit(0);
  }
};

test(); 