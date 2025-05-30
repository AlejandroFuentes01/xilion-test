import { booksService } from '@/services/api';
import { BookFilters, BookWithAuthor, PaginatedResponse } from '@/types';
import { create } from 'zustand';

interface BooksState {
    books: BookWithAuthor[];
    filters: BookFilters;
    pagination: PaginatedResponse<BookWithAuthor>['pagination'] | null;
    isLoading: boolean;
    hasNextPage: boolean;
    setFilters: (filters: Partial<BookFilters>) => void;
    loadBooks: (reset?: boolean) => Promise<void>;
    loadMoreBooks: () => Promise<void>;
    resetBooks: () => void;
}

export const useBooksStore = create<BooksState>((set, get) => ({
    books: [],
    filters: { page: 1, limit: 20 },
    pagination: null,
    isLoading: false,
    hasNextPage: true,

    setFilters: (newFilters: Partial<BookFilters>) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters, page: 1 },
        }));
    },

    loadBooks: async (reset = true) => {
        const { filters } = get();
        set({ isLoading: true });

        try {
            const response = await booksService.getBooks(filters);

            set({
                books: reset ? response.data : [...get().books, ...response.data],
                pagination: response.pagination,
                hasNextPage: response.pagination.hasNext,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
            console.error('Error loading books:', error);
        }
    },

    loadMoreBooks: async () => {
        const { filters, hasNextPage, isLoading } = get();

        if (!hasNextPage || isLoading) return;

        const nextPage = (filters.page || 1) + 1;
        set((state) => ({
            filters: { ...state.filters, page: nextPage },
        }));

        await get().loadBooks(false);
    },

    resetBooks: () => {
        set({
            books: [],
            filters: { page: 1, limit: 20 },
            pagination: null,
            hasNextPage: true,
        });
    },
}));