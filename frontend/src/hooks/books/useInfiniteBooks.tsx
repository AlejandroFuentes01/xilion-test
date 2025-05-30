'use client';

import { useBooksStore } from '@/stores/booksStore';
import { useCallback, useEffect, useRef } from 'react';
import { useInfiniteScroll } from './useInfiniteScroll';

export function useInfiniteBooks() {
    const {
        books,
        isLoading,
        hasNextPage,
        loadBooks,
        loadMoreBooks,
        filters,
        totalBooksInLibrary
    } = useBooksStore();

    const isInitialLoad = useRef(true);
    const lastFiltersRef = useRef<string>('');

    // Cargar libros inicialmente - solo una vez
    useEffect(() => {
        if (isInitialLoad.current && books.length === 0 && !isLoading) {
            console.log('📚 Initial books load');
            isInitialLoad.current = false;
            loadBooks(true);
        }
    }, []); // Solo ejecutar una vez

    // Función para cargar más libros (estable)
    const handleLoadMore = useCallback(() => {
        if (!isLoading && hasNextPage) {
            console.log('📚 Loading more books via infinite scroll');
            loadMoreBooks();
        }
    }, [isLoading, hasNextPage, loadMoreBooks]);

    // Hook de infinite scroll automático
    useInfiniteScroll({
        hasNextPage,
        isLoading,
        onLoadMore: handleLoadMore,
        threshold: 400 // Aumentado para menos sensibilidad
    });

    // Manejar scroll to top solo cuando realmente cambian los filtros
    useEffect(() => {
        const currentFilters = JSON.stringify({ search: filters.search, genre: filters.genre });
        
        // Solo hacer scroll si los filtros realmente cambiaron y hay filtros activos
        if (currentFilters !== lastFiltersRef.current && (filters.search || filters.genre)) {
            lastFiltersRef.current = currentFilters;
            console.log('🔄 Filters changed, scrolling to top');
            
            // Scroll más suave y con más delay para no interferir con el input
            setTimeout(() => {
                if (window.scrollY > 100) { // Solo hacer scroll si no está ya arriba
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }, 300); // Delay mayor para evitar interferencia con el borrado
        } else {
            lastFiltersRef.current = currentFilters;
        }
    }, [filters.search, filters.genre]);

    return {
        books,
        isLoading,
        hasNextPage,
        loadMoreBooks: handleLoadMore,
        totalBooks: books.length,
        totalBooksInLibrary,
        hasFilters: Boolean(filters.search || filters.genre)
    };
}