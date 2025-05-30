import { Router } from 'express';
import { BooksController } from '../controllers/booksController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Rutas específicas PRIMERO
router.get('/genre-stats', BooksController.getGenreStats);

// Rutas generales
router.get('/', BooksController.getAllBooks);

// Ruta corregida - details/:id en lugar de :id/details
router.get('/details/:id', BooksController.getBookDetails);

// Rutas protegidas
router.post('/', authenticateToken, BooksController.createBook);

export default router;