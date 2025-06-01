import { Application, Router } from 'express';
import authorsRoutes from './authorsRoutes';
import authRoutes from './authRoutes';
import booksRoutes from './booksRoutes';

export const configureRoutes = (app: Application) => {
    const router = Router();

    // Rutas de API - DESCOMENTADAS Y CON IMPORTS
    router.use('/auth', authRoutes);
    router.use('/books', booksRoutes);
    router.use('/authors', authorsRoutes);

    // Prefijo principal de API
    app.use('/api', router);

    // Capturar todas las rutas no definidas
    app.use('*', (req, res) => {
        res.status(404).json({
            success: false,
            message: `Route ${req.originalUrl} not found`
        });
    });
};