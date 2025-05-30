'use client';

import { useBooksStore } from '@/stores/booksStore';
import { useCallback, useEffect } from 'react';
import { useInfiniteScroll } from './useInfiniteScroll';

export function useInfiniteBooks() {
    const {
        books,
        isLoading,
        hasNextPage,
        loadBooks,
        loadMoreBooks,
        filters
    } = useBooksStore();

    // Cargar libros inicialmente
    useEffect(() => {
        if (books.length === 0) {
            loadBooks(true);
        }
    }, [books.length, loadBooks]);

    // Función para cargar más libros (memoizada para evitar re-renders)
    const handleLoadMore = useCallback(() => {
        if (!isLoading && hasNextPage) {
            loadMoreBooks();
        }
    }, [isLoading, hasNextPage, loadMoreBooks]);

    // Hook de infinite scroll automático
    useInfiniteScroll({
        hasNextPage,
        isLoading,
        onLoadMore: handleLoadMore,
        threshold: 300 // Cargar cuando estemos a 300px del final
    });

    // Resetear scroll position cuando cambien los filtros
    useEffect(() => {
        const filtersChanged = filters.search || filters.genre;
        if (filtersChanged && books.length > 0) {
            // Smooth scroll to top cuando se aplican filtros
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [filters.search, filters.genre]);

    return {
        books,
        isLoading,
        hasNextPage,
        loadMoreBooks: handleLoadMore, // Función manual también disponible
        totalBooks: books.length,
        hasFilters: Boolean(filters.search || filters.genre)
    };
}