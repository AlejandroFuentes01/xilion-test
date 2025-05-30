import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

/**
 * Router para manejar las rutas relacionadas con autenticación
 * Define endpoints para registro, login y gestión de usuarios
 */
const router = Router();

// Rutas públicas de autenticación
router.post('/register', AuthController.register);    // POST /auth/register - Registrar nuevo usuario
router.post('/login', AuthController.login);          // POST /auth/login - Iniciar sesión
router.post('/refresh', AuthController.refreshToken); // POST /auth/refresh - Renovar token

// Rutas protegidas (requieren autenticación)
router.get('/profile', authenticateToken, AuthController.getProfile);    // GET /auth/profile - Obtener perfil del usuario
router.put('/profile', authenticateToken, AuthController.updateProfile); // PUT /auth/profile - Actualizar perfil
router.post('/logout', authenticateToken, AuthController.logout);        // POST /auth/logout - Cerrar sesión

export default router;