// Modelos Base
export interface Book {
    id: string;
    title: string;
    authorId: string;
    genre: string;
    publishedYear: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Author {
    id: string;
    name: string;
    birthYear: number;
    nationality: string;
    createdAt: Date;
    updatedAt: Date;
}

// Tipos Extendidos
export interface BookWithAuthor extends Book {
    author: Author;
}

export interface AuthorWithStats extends Author {
    booksCount: number;
    averagePublicationYear?: number;
    authorImpactScore?: number;
    books?: Book[];
}

// Tipos de Petición/Respuesta de API
export interface CreateBookRequest {
    title: string;
    authorId: string;
    genre: string;
    publishedYear: number;
}

export interface AuthRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        username: string;
    };
}

// Paginación
export interface PaginationQuery {
    page?: number;
    limit?: number;
    genre?: string;
    search?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// Estadísticas de Géneros
export interface GenreStats {
    genre: string;
    bookCount: number;
    averagePublicationYear: number;
}

// Payload JWT
export interface JWTPayload {
    userId: string;
    username: string;
    iat?: number;
    exp?: number;
}

// Envoltorio de Respuesta API
export interface APIResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// Géneros Predefinidos
export const VALID_GENRES = [
    'Fiction',
    'Non-Fiction',
    'Mystery',
    'Romance',
    'Science Fiction',
    'Fantasy',
    'Thriller',
    'Biography',
    'History',
    'Self-Help',
    'Poetry',
    'Drama',
    'Horror',
    'Adventure',
    'Classic'
] as const;

export type ValidGenre = typeof VALID_GENRES[number];