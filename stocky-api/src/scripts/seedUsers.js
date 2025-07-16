import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import '../models/User.js';
const User = mongoose.model('User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stocky';

const users = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'user',
    email: 'user@example.com',
    password: 'user123',
    role: 'user'
  }
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  for (const u of users) {
    const exists = await User.findOne({ username: u.username });
    if (exists) {
      console.log(`Usuario ${u.username} ya existe, omitiendo.`);
      continue;
    }
    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({ ...u, password: hashed });
    console.log(`Usuario ${u.username} creado.`);
  }
  await mongoose.disconnect();
  console.log('Seed finalizado.');
}

seed().catch(e => { console.error(e); process.exit(1); }); 