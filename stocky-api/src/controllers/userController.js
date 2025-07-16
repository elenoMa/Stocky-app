import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// GET /api/users
export async function listUsers(req, res) {
  const users = await User.find({}, '-password');
  res.json(users);
}

// POST /api/users
export async function createUser(req, res) {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }
  const exists = await User.findOne({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(409).json({ message: 'El usuario o email ya existe.' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed, role: role || 'user' });
  res.status(201).json({ id: user._id, username: user.username, email: user.email, role: user.role });
}

// PUT /api/users/:id
export async function updateUser(req, res) {
  const { id } = req.params;
  const { username, email, password, role } = req.body;
  const update = {};
  if (username) update.username = username;
  if (email) update.email = email;
  if (role) update.role = role;
  if (password) update.password = await bcrypt.hash(password, 10);
  const user = await User.findByIdAndUpdate(id, update, { new: true, select: '-password' });
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
  res.json(user);
}

// DELETE /api/users/:id
export async function deleteUser(req, res) {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
  res.json({ message: 'Usuario eliminado.' });
} 