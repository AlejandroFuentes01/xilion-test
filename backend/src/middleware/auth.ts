import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

// Extender el tipo Request de Express para incluir el usuario
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    // Bearer TOKEN - Obtiene el token del encabezado de autorización
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Se requiere token de acceso'
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
            return;
        }

        res.status(403).json({
            success: false,
            message: 'Token inválido'
        });
        return;
    }
};

// Autenticación opcional - para endpoints que funcionan con o sin autenticación
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        next(); // Continuar sin usuario
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
        req.user = decoded;
    } catch (error) {
        // Ignorar errores de token en autenticación opcional
    }

    next();
};