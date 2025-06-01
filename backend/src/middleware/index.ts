import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

export const configureMiddleware = (app: express.Application) => {
    // CORS actualizado para incluir Vercel
    app.use(cors({
        origin: [
            'http://localhost:3001',                                    // Desarrollo local
            'https://library-frontend-snowy.vercel.app',               // Tu URL de Vercel
            'https://*.vercel.app',                                     // Cualquier app de Vercel
            'https://vercel.app'                                        // Dominios de Vercel
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Resto del middleware
    app.use(helmet());
    app.use(morgan('combined'));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    // Endpoint de verificación de salud
    app.get('/health', (req, res) => {
        res.json({
            success: true,
            message: 'Server is healthy',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV
        });
    });
};