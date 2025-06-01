import { APIResponse, AuthorWithStats, AuthResponse, BookFilters, BookWithAuthor, GenreStats, PaginatedResponse } from '@/types';
import axios from 'axios';

// Configuración base de API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://xilion-test-production.up.railway.app/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Agregar token de autenticación a las peticiones
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Servicios de Autenticación
export const authService = {
    async login(username: string, password: string): Promise<AuthResponse> {
        const response = await api.post<APIResponse<AuthResponse>>('/auth/login', {
            username,
            password,
        });
        return response.data.data!;
    },

    async register(username: string, password: string): Promise<AuthResponse> {
        const response = await api.post<APIResponse<AuthResponse>>('/auth/register', {
            username,
            password,
        });
        return response.data.data!;
    },

    async getProfile(): Promise<any> {
        const response = await api.get<APIResponse>('/auth/profile');
        return response.data.data;
    },
};

// Servicios de Libros
export const booksService = {
    async getBooks(filters: BookFilters = {}): Promise<PaginatedResponse<BookWithAuthor>> {
        const params = new URLSearchParams();

        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.genre) params.append('genre', filters.genre);
        if (filters.search) params.append('search', filters.search);

        const response = await api.get<APIResponse<PaginatedResponse<BookWithAuthor>>>(
            `/books?${params.toString()}`
        );
        return response.data.data!;
    },

    async getBookDetails(bookId: string): Promise<{ book: BookWithAuthor; author: AuthorWithStats }> {
        const response = await api.get<APIResponse<{ book: BookWithAuthor; author: AuthorWithStats }>>(
            `/books/details/${bookId}`
        );
        return response.data.data!;
    },

    async getGenreStats(): Promise<GenreStats[]> {
        const response = await api.get<APIResponse<GenreStats[]>>('/books/genre-stats');
        return response.data.data!;
    },

    async createBook(bookData: {
        title: string;
        authorId: string;
        genre: string;
        publishedYear: number;
    }): Promise<BookWithAuthor> {
        const response = await api.post<APIResponse<BookWithAuthor>>('/books', bookData);
        return response.data.data!;
    },
};

// Servicios de Autores
export const authorsService = {
    async getAuthors(): Promise<AuthorWithStats[]> {
        const response = await api.get<APIResponse<AuthorWithStats[]>>('/authors');
        return response.data.data!;
    },

    async getAuthorById(authorId: string): Promise<AuthorWithStats> {
        const response = await api.get<APIResponse<AuthorWithStats>>(`/authors/${authorId}`);
        return response.data.data!;
    },
};