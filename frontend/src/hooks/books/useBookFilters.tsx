'use client';

import { useBooksStore } from '@/stores/booksStore';
import { useCallback, useEffect, useState } from 'react';

// Hook para debouncing
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function useBookFilters() {
    const { filters, setFilters, loadBooks, resetBooks } = useBooksStore();

    // Estados locales para los inputs
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedGenre, setSelectedGenre] = useState(filters.genre || '');

    // Debounce para la búsqueda (300ms)
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Sincronizar estados locales con el store al montar
    useEffect(() => {
        setSearchQuery(filters.search || '');
        setSelectedGenre(filters.genre || '');
    }, [filters.search, filters.genre]);

    // Aplicar búsqueda automáticamente con debounce
    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            handleSearchInternal(debouncedSearch, selectedGenre);
        }
    }, [debouncedSearch]);

    // Función interna para manejar búsqueda
    const handleSearchInternal = useCallback((search: string, genre: string) => {
        setFilters({
            search: search || undefined,
            genre: genre || undefined,
            page: 1
        });
        loadBooks(true); // Reset = true para nueva búsqueda
    }, [setFilters, loadBooks]);

    // Manejar búsqueda manual (botón)
    const handleSearch = useCallback(() => {
        handleSearchInternal(searchQuery, selectedGenre);
    }, [searchQuery, selectedGenre, handleSearchInternal]);

    // Manejar cambio de género
    const handleGenreChange = useCallback((genre: string) => {
        setSelectedGenre(genre);
        handleSearchInternal(searchQuery, genre);
    }, [searchQuery, handleSearchInternal]);

    // Limpiar filtros
    const handleClearFilters = useCallback(() => {
        setSearchQuery('');
        setSelectedGenre('');
        resetBooks();
        setFilters({ page: 1, limit: 20 });
        loadBooks(true);
    }, [setFilters, loadBooks, resetBooks]);

    return {
        searchQuery,
        setSearchQuery,
        selectedGenre,
        setSelectedGenre: handleGenreChange, // Usar la función que maneja el cambio
        handleSearch,
        handleClearFilters
    };
}