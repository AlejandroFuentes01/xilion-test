import { Request, Response } from 'express';
import { z } from 'zod';
import { authorsDB, booksDB } from '../config/database';
import {
    APIResponse,
    AuthorWithStats,
    BookWithAuthor,
    GenreStats,
    PaginatedResponse,
    VALID_GENRES
} from '../types';

// Esquemas de validación
const createBookSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
    authorId: z.string().min(1, 'Author ID is required'),
    genre: z.enum(VALID_GENRES, { errorMap: () => ({ message: 'Invalid genre' }) }),
    publishedYear: z.number().int().min(1000).max(new Date().getFullYear() + 10)
});

const querySchema = z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
    genre: z.string().optional(),
    search: z.string().optional()
});

/**
 * Controlador para manejar operaciones relacionadas con libros
 * Provee endpoints para listar, crear y obtener detalles de libros
 */
export class BooksController {
    /**
     * Obtiene todos los libros con paginación y filtrado
     * GET /api/books - Devuelve lista paginada de libros
     */
    static async getAllBooks(req: Request, res: Response): Promise<any> {
        try {
            // Extraer y validar parámetros de consulta
            const { page, limit, genre, search } = querySchema.parse(req.query);
            const offset = (page - 1) * limit;

            // Construir cláusula where para filtrado
            const where: any = {};
            if (genre) {
                where.genre = genre;
            }
            if (search) {
                where.title = {
                    contains: search
                };
            }

            // Obtener libros con paginación
            const [books, totalBooks] = await Promise.all([
                booksDB.book.findMany({
                    where,
                    skip: offset,
                    take: limit,
                    orderBy: { createdAt: 'desc' }
                }),
                booksDB.book.count({ where })
            ]);

            // Obtener autores para estos libros
            const authorIds = [...new Set(books.map(book => book.authorId))];
            const authors = await authorsDB.author.findMany({
                where: {
                    id: { in: authorIds }
                }
            });

            // Combinar libros con sus autores
            const booksWithAuthors: BookWithAuthor[] = books.map(book => {
                const author = authors.find(a => a.id === book.authorId);
                return {
                    ...book,
                    author: author || {
                        id: book.authorId,
                        name: 'Unknown Author',
                        birthYear: 0,
                        nationality: 'Unknown',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                };
            });

            // Calcular información de paginación
            const totalPages = Math.ceil(totalBooks / limit);

            const response: PaginatedResponse<BookWithAuthor> = {
                data: booksWithAuthors,
                pagination: {
                    page,
                    limit,
                    total: totalBooks,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            };

            // Enviar respuesta exitosa
            res.json({
                success: true,
                data: response,
                message: 'Books retrieved successfully'
            } as APIResponse<PaginatedResponse<BookWithAuthor>>);

        } catch (error) {
            // Manejar errores de validación
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Parámetros de consulta inválidos',
                    error: error.errors[0].message
                } as APIResponse);
            }

            // Manejar otros errores
            console.error('Error al obtener libros:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            } as APIResponse);
        }
    }

    /**
     * Crea un nuevo libro
     * POST /api/books - Crea un nuevo libro en la base de datos
     */
    static async createBook(req: Request, res: Response): Promise<any> {
        try {
            // Validar datos del libro
            const bookData = createBookSchema.parse(req.body);

            // Verificar que el autor existe
            const author = await authorsDB.author.findUnique({
                where: { id: bookData.authorId }
            });

            if (!author) {
                return res.status(400).json({
                    success: false,
                    message: 'Autor no encontrado'
                } as APIResponse);
            }

            // Crear el libro
            const newBook = await booksDB.book.create({
                data: bookData
            });

            // Combinar libro con información del autor
            const bookWithAuthor: BookWithAuthor = {
                ...newBook,
                author
            };

            // Enviar respuesta exitosa
            res.status(201).json({
                success: true,
                data: bookWithAuthor,
                message: 'Libro creado exitosamente'
            } as APIResponse<BookWithAuthor>);

        } catch (error) {
            // Manejar errores de validación
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Error de validación',
                    error: error.errors[0].message
                } as APIResponse);
            }

            // Manejar otros errores
            console.error('Error al crear libro:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            } as APIResponse);
        }
    }

    /**
     * Obtiene estadísticas de géneros literarios
     * GET /api/books/genre-stats - Devuelve estadísticas agrupadas por género
     */
    static async getGenreStats(req: Request, res: Response): Promise<any> {
        try {
            // Esto sería mejor como una función SQL personalizada, pero lo haremos con Prisma
            const books = await booksDB.book.findMany({
                select: {
                    genre: true,
                    publishedYear: true
                }
            });

            // Agrupar por género y calcular estadísticas
            const genreMap = new Map<string, number[]>();

            books.forEach(book => {
                if (!genreMap.has(book.genre)) {
                    genreMap.set(book.genre, []);
                }
                genreMap.get(book.genre)!.push(book.publishedYear);
            });

            // Crear array de estadísticas por género
            const genreStats: GenreStats[] = Array.from(genreMap.entries()).map(([genre, years]) => ({
                genre,
                bookCount: years.length,
                averagePublicationYear: Math.round(years.reduce((sum, year) => sum + year, 0) / years.length)
            }));

            // Ordenar por cantidad de libros (descendente)
            genreStats.sort((a, b) => b.bookCount - a.bookCount);

            // Enviar respuesta exitosa
            res.json({
                success: true,
                data: genreStats,
                message: 'Estadísticas de géneros obtenidas exitosamente'
            } as APIResponse<GenreStats[]>);

        } catch (error) {
            // Manejar errores
            console.error('Error al obtener estadísticas de género:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            } as APIResponse);
        }
    }

    /**
     * Obtiene detalles completos de un libro incluyendo métricas del autor
     * GET /api/books/:id/details - Devuelve información detallada de un libro y su autor
     */
    static async getBookDetails(req: Request, res: Response): Promise<any> {
        try {
            const bookId = req.params.id;

            // Obtener el libro
            const book = await booksDB.book.findUnique({
                where: { id: bookId }
            });

            if (!book) {
                return res.status(404).json({
                    success: false,
                    message: 'Libro no encontrado'
                } as APIResponse);
            }

            // Obtener el autor
            const author = await authorsDB.author.findUnique({
                where: { id: book.authorId }
            });

            if (!author) {
                return res.status(404).json({
                    success: false,
                    message: 'Autor no encontrado'
                } as APIResponse);
            }

            // Obtener todos los libros de este autor
            const authorBooks = await booksDB.book.findMany({
                where: { authorId: author.id },
                orderBy: { publishedYear: 'desc' }
            });

            // Calcular Puntuación de Impacto del Autor
            const currentYear = new Date().getFullYear();
            const totalBooksWritten = authorBooks.length;
            const averagePublicationYear = Math.round(
                authorBooks.reduce((sum, b) => sum + b.publishedYear, 0) / totalBooksWritten
            );
            const authorImpactScore = (totalBooksWritten * 10) + (currentYear - averagePublicationYear);

            // Crear objeto con estadísticas del autor
            const authorWithStats: AuthorWithStats = {
                ...author,
                booksCount: totalBooksWritten,
                averagePublicationYear,
                authorImpactScore,
                books: authorBooks
            };

            // Componer respuesta con libro y autor
            const response = {
                book,
                author: authorWithStats
            };

            // Enviar respuesta exitosa
            res.json({
                success: true,
                data: response,
                message: 'Detalles del libro obtenidos exitosamente'
            } as APIResponse);

        } catch (error) {
            // Manejar errores
            console.error('Error al obtener detalles del libro:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            } as APIResponse);
        }
    }
}