import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { UserService } from '../models/User';
import { APIResponse, AuthResponse } from '../types';

// Esquemas de validación para autenticación
const loginSchema = z.object({
    username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

const registerSchema = z.object({
    username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

/**
 * Controlador para manejar operaciones de autenticación
 * Maneja login, registro, perfil y gestión de tokens JWT
 */
export class AuthController {
    /**
     * Autentica a un usuario y genera un token JWT
     * POST /auth/login - Iniciar sesión
     */
    static async login(req: Request, res: Response): Promise<void> {
        try {
            // Validar datos de entrada
            const { username, password } = loginSchema.parse(req.body);

            // Buscar usuario en la base de datos
            const user = await UserService.findByUsername(username);
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                } as APIResponse);
                return;
            }

            // Validar contraseña
            const isValidPassword = await UserService.validatePassword(password, user.password);
            if (!isValidPassword) {
                res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                } as APIResponse);
                return;
            }

            // Verificar que el JWT_SECRET existe
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                res.status(500).json({
                    success: false,
                    message: 'Error de configuración del servidor'
                } as APIResponse);
                return;
            }

            // Generar token JWT
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                jwtSecret,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            const response: AuthResponse = {
                token,
                user: {
                    id: user.id,
                    username: user.username
                }
            };

            res.json({
                success: true,
                data: response,
                message: 'Inicio de sesión exitoso'
            } as APIResponse<AuthResponse>);

        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Error de validación',
                    error: error.errors[0].message
                } as APIResponse);
                return;
            }

            console.error('Error de login:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            } as APIResponse);
        }
    }

    /**
     * Registra un nuevo usuario en el sistema
     * POST /auth/register - Crear cuenta nueva
     */
    static async register(req: Request, res: Response): Promise<void> {
        try {
            // Validar datos de entrada
            const { username, password } = registerSchema.parse(req.body);

            // Verificar si el usuario ya existe
            const existingUser = await UserService.findByUsername(username);
            if (existingUser) {
                res.status(409).json({
                    success: false,
                    message: 'El nombre de usuario ya existe'
                } as APIResponse);
                return;
            }

            // Crear nuevo usuario
            const newUser = await UserService.createUser(username, password);

            // Verificar que el JWT_SECRET existe
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                res.status(500).json({
                    success: false,
                    message: 'Error de configuración del servidor'
                } as APIResponse);
                return;
            }

            // Generar token JWT
            const token = jwt.sign(
                { userId: newUser.id, username: newUser.username },
                jwtSecret,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            const response: AuthResponse = {
                token,
                user: {
                    id: newUser.id,
                    username: newUser.username
                }
            };

            res.status(201).json({
                success: true,
                data: response,
                message: 'Usuario registrado exitosamente'
            } as APIResponse<AuthResponse>);

        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Error de validación',
                    error: error.errors[0].message
                } as APIResponse);
                return;
            }

            console.error('Error de registro:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            } as APIResponse);
        }
    }

    /**
     * Obtiene el perfil del usuario autenticado
     * GET /auth/profile - Información del usuario actual
     */
    static async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                } as APIResponse);
                return;
            }

            const user = await UserService.findById(userId);
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                } as APIResponse);
                return;
            }

            res.json({
                success: true,
                data: {
                    id: user.id,
                    username: user.username,
                    createdAt: user.createdAt
                },
                message: 'Perfil obtenido exitosamente'
            } as APIResponse);

        } catch (error) {
            console.error('Error al obtener perfil:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            } as APIResponse);
        }
    }

    /**
     * Renueva el token de acceso del usuario
     * POST /auth/refresh - Renovar token JWT
     */
    static async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                res.status(401).json({
                    success: false,
                    message: 'Token requerido'
                } as APIResponse);
                return;
            }

            // Verificar el token actual
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                res.status(500).json({
                    success: false,
                    message: 'Error de configuración del servidor'
                } as APIResponse);
                return;
            }

            const decoded = jwt.verify(token, jwtSecret) as any;
            const user = await UserService.findById(decoded.userId);

            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                } as APIResponse);
                return;
            }

            // Generar nuevo token
            const newToken = jwt.sign(
                { userId: user.id, username: user.username },
                jwtSecret,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            const response: AuthResponse = {
                token: newToken,
                user: {
                    id: user.id,
                    username: user.username
                }
            };

            res.json({
                success: true,
                data: response,
                message: 'Token renovado exitosamente'
            } as APIResponse<AuthResponse>);

        } catch (error) {
            console.error('Error al renovar token:', error);
            res.status(401).json({
                success: false,
                message: 'Token inválido'
            } as APIResponse);
        }
    }

    /**
     * Actualiza el perfil del usuario autenticado
     * PUT /auth/profile - Actualizar información del perfil
     */
    static async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                } as APIResponse);
                return;
            }

            // Esquema de validación para actualización de perfil
            const updateSchema = z.object({
                username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres').optional(),
                password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional()
            });

            const updateData = updateSchema.parse(req.body);

            // Verificar si el nuevo username ya existe (si se está cambiando)
            if (updateData.username) {
                const existingUser = await UserService.findByUsername(updateData.username);
                if (existingUser && existingUser.id !== userId) {
                    res.status(409).json({
                        success: false,
                        message: 'El nombre de usuario ya existe'
                    } as APIResponse);
                    return;
                }
            }

            // Actualizar usuario
            const updatedUser = await UserService.updateUser(userId, updateData);

            res.json({
                success: true,
                data: {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    updatedAt: updatedUser.updatedAt
                },
                message: 'Perfil actualizado exitosamente'
            } as APIResponse);

        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Error de validación',
                    error: error.errors[0].message
                } as APIResponse);
                return;
            }

            console.error('Error al actualizar perfil:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            } as APIResponse);
        }
    }

    /**
     * Cierra la sesión del usuario (invalidar token)
     * POST /auth/logout - Cerrar sesión del usuario
     */
    static async logout(req: Request, res: Response): Promise<void> {
        try {
            // En una implementación real, aquí se podría agregar el token a una lista negra
            // Por ahora, simplemente confirmamos el logout
            res.json({
                success: true,
                message: 'Sesión cerrada exitosamente'
            } as APIResponse);

        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            } as APIResponse);
        }
    }
}