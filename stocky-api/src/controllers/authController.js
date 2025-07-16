import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// POST /api/auth/register
async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: 'El usuario o email ya existe.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'Usuario registrado correctamente.' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el registro.', error: err.message });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña requeridos.' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
    }
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Error en el login.', error: err.message });
  }
}

export default { register, login }; 