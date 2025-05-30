import { Application, Router } from 'express';
import authorsRoutes from './authorsRoutes';
import authRoutes from './authRoutes';
import booksRoutes from './booksRoutes';

export const configureRoutes = (app: Application) => {
    const router = Router();

    // API routes - DESCOMENTADAS Y CON IMPORTS
    router.use('/auth', authRoutes);
    router.use('/books', booksRoutes);
    router.use('/authors', authorsRoutes);

    // Main API prefix
    app.use('/api', router);

    // Catch-all for undefined routes
    app.use('*', (req, res) => {
        res.status(404).json({
            success: false,
            message: `Route ${req.originalUrl} not found`
        });
    });
};