import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

// Función para configurar los middleware de la aplicación
export const configureMiddleware = (app: express.Application) => {
    // Middleware de seguridad usando helmet
    app.use(helmet());

    // Configuración de CORS para permitir peticiones desde el frontend
    app.use(cors({
        // URL del frontend permitida
        origin: process.env.FRONTEND_URL || 'http://localhost:3001',
        // Permite credenciales en las peticiones
        credentials: true,
        // Métodos HTTP permitidos
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        // Cabeceras permitidas en las peticiones
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Registro de peticiones HTTP (solo en modo desarrollo)
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // Configuración del parseado del cuerpo de las peticiones
    // Permite procesar JSON con un límite de 10mb
    app.use(express.json({ limit: '10mb' }));
    // Permite procesar datos de formularios con un límite de 10mb
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Ruta para verificar el estado del servidor
    app.get('/health', (req, res) => {
        res.json({
            success: true,
            message: 'Server is healthy',
            timestamp: new Date().toISOString()
        });
    });
};