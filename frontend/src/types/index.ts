// Modelos Base (sincronizado con backend)
export interface Book {
    id: string;
    title: string;
    authorId: string;
    genre: string;
    publishedYear: number;
    createdAt: string;
    updatedAt: string;
}

export interface Author {
    id: string;
    name: string;
    birthYear: number;
    nationality: string;
    createdAt: string;
    updatedAt: string;
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

// Tipos de Respuesta API
export interface APIResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
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

// Tipos de Autenticación
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        username: string;
    };
}

export interface User {
    id: string;
    username: string;
    token?: string;
}

// Estadísticas de Género
export interface GenreStats {
    genre: string;
    bookCount: number;
    averagePublicationYear: number;
}

// Tipos de Filtro y Búsqueda
export interface BookFilters {
    search?: string;
    genre?: string;
    page?: number;
    limit?: number;
}

// Géneros Predefinidos (sincronizado con backend)
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

// Tipos de Contenido de Libro
export interface BookContent {
    id: string;
    bookId: string;
    content: string;
    hasRealContent: boolean;
}

// Libro Extendido con contenido
export interface BookWithContent extends BookWithAuthor {
    hasRealContent?: boolean;
    contentPreview?: string;
}