import { Request, Response } from 'express';
import { authorsDB, booksDB } from '../config/database';
import { APIResponse, AuthorWithStats } from '../types';

/**
 * Controlador para manejar operaciones relacionadas con autores
 * Provee endpoints para listar y obtener detalles de autores
 */
export class AuthorsController {
    /**
     * Obtiene todos los autores con su conteo de libros
     * GET /api/authors - Devuelve la lista de autores ordenada por cantidad de libros
     */
    static async getAllAuthors(req: Request, res: Response) {
        try {
            // Obtener todos los autores ordenados alfabéticamente
            const authors = await authorsDB.author.findMany({
                orderBy: { name: 'asc' }
            });

            // Calcular estadísticas para cada autor (cantidad de libros)
            const authorsWithStats: AuthorWithStats[] = await Promise.all(
                authors.map(async (author) => {
                    // Contar libros por autor
                    const booksCount = await booksDB.book.count({
                        where: { authorId: author.id }
                    });

                    // Devolver autor con estadísticas
                    return {
                        ...author,
                        booksCount
                    };
                })
            );

            // Ordenar por cantidad de libros (descendente)
            authorsWithStats.sort((a, b) => b.booksCount - a.booksCount);

            // Enviar respuesta exitosa
            res.json({
                success: true,
                data: authorsWithStats,
                message: 'Authors retrieved successfully'
            } as APIResponse<AuthorWithStats[]>);

        } catch (error) {
            // Log y manejo del error
            console.error('Error al obtener autores:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            } as APIResponse);
        }
    }

    /**
     * Obtiene detalles de un autor específico con sus métricas y libros
     * GET /api/authors/:id - Devuelve información detallada de un autor
     */
    static async getAuthorById(req: Request, res: Response): Promise<any> {
        try {
            const authorId = req.params.id;

            // Buscar el autor en la base de datos
            const author = await authorsDB.author.findUnique({
                where: { id: authorId }
            });

            // Verificar si el autor existe
            if (!author) {
                return res.status(404).json({
                    success: false,
                    message: 'Autor no encontrado'
                } as APIResponse);
            }

            // Obtener los libros del autor
            const books = await booksDB.book.findMany({
                where: { authorId: author.id },
                orderBy: { publishedYear: 'desc' }
            });

            // Calcular métricas del autor
            const booksCount = books.length;
            
            // Calcular año promedio de publicación (si tiene libros)
            const averagePublicationYear = booksCount > 0
                ? Math.round(books.reduce((sum, book) => sum + book.publishedYear, 0) / booksCount)
                : 0;

            // Calcular puntuación de impacto del autor
            // Fórmula: (cantidad de libros * 10) + (año actual - año promedio de publicación)
            const currentYear = new Date().getFullYear();
            const authorImpactScore = (booksCount * 10) + (currentYear - averagePublicationYear);

            // Crear objeto con toda la información del autor
            const authorWithStats: AuthorWithStats = {
                ...author,
                booksCount,
                averagePublicationYear,
                authorImpactScore,
                books
            };

            // Enviar respuesta exitosa
            res.json({
                success: true,
                data: authorWithStats,
                message: 'Author retrieved successfully'
            } as APIResponse<AuthorWithStats>);

        } catch (error) {
            // Log y manejo del error
            console.error('Error al obtener detalles del autor:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            } as APIResponse);
        }
    }
}