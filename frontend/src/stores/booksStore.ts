import { booksService } from '@/services/api';
import { BookFilters, BookWithAuthor, PaginatedResponse } from '@/types';
import { create } from 'zustand';

interface BooksState {
    books: BookWithAuthor[];
    filters: BookFilters;
    pagination: PaginatedResponse<BookWithAuthor>['pagination'] | null;
    isLoading: boolean;
    isLoadingMore: boolean;
    hasNextPage: boolean;
    error: string | null;
    totalBooksInLibrary: number;
    setFilters: (filters: Partial<BookFilters>) => void;
    loadBooks: (reset?: boolean) => Promise<void>;
    loadMoreBooks: () => Promise<void>;
    resetBooks: () => void;
    clearError: () => void;
}

// Función helper para comparar filtros
const areFiltersEqual = (filters1: BookFilters, filters2: BookFilters): boolean => {
    return (
        filters1.search === filters2.search &&
        filters1.genre === filters2.genre &&
        filters1.page === filters2.page &&
        filters1.limit === filters2.limit
    );
};

export const useBooksStore = create<BooksState>((set, get) => ({
    books: [],
    filters: { page: 1, limit: 20 },
    pagination: null,
    isLoading: false,
    isLoadingMore: false,
    hasNextPage: true,
    error: null,
    totalBooksInLibrary: 0,

    setFilters: (newFilters: Partial<BookFilters>) => {
        const currentFilters = get().filters;
        const updatedFilters = { ...currentFilters, ...newFilters };

        // Si cambió search o genre, reset page
        if (newFilters.search !== undefined || newFilters.genre !== undefined) {
            updatedFilters.page = 1;
        }

        // Solo actualizar si realmente cambió algo
        if (!areFiltersEqual(currentFilters, updatedFilters)) {
            console.log('🔄 Manual search filters applied:', { 
                old: currentFilters, 
                new: updatedFilters 
            });
            set({ filters: updatedFilters, error: null });
        }
    },

    loadBooks: async (reset = true) => {
        const { filters, isLoading, isLoadingMore } = get();

        // Evitar múltiples llamadas simultáneas
        if (isLoading || isLoadingMore) {
            console.log('⏭️ Skipping load - already loading:', { isLoading, isLoadingMore });
            return;
        }

        const loadingState = reset ? 'isLoading' : 'isLoadingMore';
        set({ [loadingState]: true, error: null });

        try {
            console.log(`📚 Loading books (${reset ? 'new search' : 'load more'}):`, {
                ...filters,
                searchActive: !!filters.search,
                genreActive: !!filters.genre
            });
            
            const response = await booksService.getBooks(filters);

            console.log('📚 Books response:', {
                received: response.data.length,
                hasNext: response.pagination.hasNext,
                total: response.pagination.total,
                page: response.pagination.page,
                searchTerm: filters.search || 'none',
                genre: filters.genre || 'all'
            });

            // Determinar si actualizar el total de la biblioteca
            const isWithoutFilters = !filters.search && !filters.genre;
            const currentTotal = get().totalBooksInLibrary;
            const newTotal = (isWithoutFilters && response.pagination.total > currentTotal)
                ? response.pagination.total
                : currentTotal;

            // Actualizar estado de manera atómica
            set((state) => ({
                books: reset ? response.data : [...state.books, ...response.data],
                pagination: response.pagination,
                hasNextPage: response.pagination.hasNext,
                isLoading: false,
                isLoadingMore: false,
                error: null,
                totalBooksInLibrary: newTotal
            }));

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
        console.log('📄 Loading more books - Next page:', nextPage);

        // Actualizar página y cargar
        set((state) => ({
            filters: { ...state.filters, page: nextPage }
        }));

        await get().loadBooks(false);
    },

    resetBooks: () => {
        console.log('🧹 Resetting books store to initial state');
        const currentTotal = get().totalBooksInLibrary;

        set({
            books: [],
            filters: { page: 1, limit: 20 },
            pagination: null,
            hasNextPage: true,
            isLoading: false,
            isLoadingMore: false,
            error: null,
            totalBooksInLibrary: currentTotal
        });
    },

    clearError: () => {
        set({ error: null });
    }
}));