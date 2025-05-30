import { booksService } from '@/services/api';
import { BookFilters, BookWithAuthor, PaginatedResponse } from '@/types';
import { create } from 'zustand';

interface BooksState {
    books: BookWithAuthor[];
    filters: BookFilters;
    pagination: PaginatedResponse<BookWithAuthor>['pagination'] | null;
    isLoading: boolean;
    isLoadingMore: boolean; // Separar loading inicial de load more
    hasNextPage: boolean;
    error: string | null;
    setFilters: (filters: Partial<BookFilters>) => void;
    loadBooks: (reset?: boolean) => Promise<void>;
    loadMoreBooks: () => Promise<void>;
    resetBooks: () => void;
    clearError: () => void;
}

export const useBooksStore = create<BooksState>((set, get) => ({
    books: [],
    filters: { page: 1, limit: 20 },
    pagination: null,
    isLoading: false,
    isLoadingMore: false,
    hasNextPage: true,
    error: null,

    setFilters: (newFilters: Partial<BookFilters>) => {
        const currentFilters = get().filters;
        const updatedFilters = { ...currentFilters, ...newFilters };

        // Si cambió search o genre, reset page
        if (newFilters.search !== undefined || newFilters.genre !== undefined) {
            updatedFilters.page = 1;
        }

        set({ filters: updatedFilters, error: null });
    },

    loadBooks: async (reset = true) => {
        const { filters, isLoading, isLoadingMore } = get();

        // Evitar múltiples llamadas simultáneas
        if (isLoading || isLoadingMore) return;

        set({
            isLoading: reset,
            isLoadingMore: !reset,
            error: null
        });

        try {
            console.log('📚 Loading books with filters:', filters);
            const response = await booksService.getBooks(filters);

            console.log('📚 Books loaded:', {
                newBooks: response.data.length,
                hasNext: response.pagination.hasNext,
                total: response.pagination.total
            });

            set({
                books: reset ? response.data : [...get().books, ...response.data],
                pagination: response.pagination,
                hasNextPage: response.pagination.hasNext,
                isLoading: false,
                isLoadingMore: false,
                error: null
            });
        } catch (error: any) {
            console.error('❌ Error loading books:', error);
            set({
                isLoading: false,
                isLoadingMore: false,
                error: error.response?.data?.message || 'Failed to load books'
            });
        }
    },

    loadMoreBooks: async () => {
        const { filters, hasNextPage, isLoading, isLoadingMore } = get();

        if (!hasNextPage || isLoading || isLoadingMore) {
            console.log('⏭️ Skipping load more:', { hasNextPage, isLoading, isLoadingMore });
            return;
        }

        const nextPage = (filters.page || 1) + 1;
        console.log('📄 Loading more books - Page:', nextPage);

        set((state) => ({
            filters: { ...state.filters, page: nextPage },
        }));

        await get().loadBooks(false);
    },

    resetBooks: () => {
        console.log('🔄 Resetting books store');
        set({
            books: [],
            filters: { page: 1, limit: 20 },
            pagination: null,
            hasNextPage: true,
            isLoading: false,
            isLoadingMore: false,
            error: null
        });
    },

    clearError: () => {
        set({ error: null });
    }
}));