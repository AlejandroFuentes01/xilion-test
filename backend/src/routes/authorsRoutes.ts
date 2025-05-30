import { Router } from 'express';
import { AuthorsController } from '../controllers/authorsController';

/**
 * Router para manejar las rutas relacionadas con autores
 * Define endpoints para listar y obtener detalles de autores
 */
const router = Router();

// Rutas públicas de autores
router.get('/', AuthorsController.getAllAuthors);        // GET /api/authors - Obtener todos los autores
router.get('/:id', AuthorsController.getAuthorById);     // GET /api/authors/:id - Obtener autor por ID

export default router;