import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

// Registro de usuario
router.post('/register', authController.register);

// Login de usuario
router.post('/login', authController.login);

// Refresh token
router.post('/refresh', authController.refreshToken);

export default router; 