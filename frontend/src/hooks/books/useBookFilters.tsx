'use client';

import { useBooksStore } from '@/stores/booksStore';
import { useCallback, useEffect, useState } from 'react';

export function useBookFilters() {
    const { filters, setFilters, loadBooks, resetBooks } = useBooksStore();

    // Estados locales para los inputs - COMPLETAMENTE independientes del store
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');

    // Inicializar UNA VEZ con los valores del store
    useEffect(() => {
        setSearchQuery(filters.search || '');
        setSelectedGenre(filters.genre || '');
    }, []); // Solo al montar

    // Función de búsqueda manual unificada
    const executeSearch = useCallback(() => {
        console.log('🔍 Manual search executed:', { 
            search: searchQuery.trim(), 
            genre: selectedGenre 
        });

        setFilters({
            search: searchQuery.trim() || undefined,
            genre: selectedGenre || undefined,
            page: 1
        });
        loadBooks(true);
    }, [searchQuery, selectedGenre, setFilters, loadBooks]);

    // Manejar cambio en búsqueda - SOLO actualizar estado local
    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
        // NO hacer búsqueda automática
    }, []);

    // Manejar cambio de género - TAMBIÉN manual ahora
    const handleGenreChange = useCallback((genre: string) => {
        setSelectedGenre(genre);
        // NO hacer búsqueda automática - esperar a que usuario presione Search o Enter
    }, []);

    // Manejar búsqueda manual (Enter o botón)
    const handleSearch = useCallback(() => {
        executeSearch();
    }, [executeSearch]);

    // Limpiar filtros
    const handleClearFilters = useCallback(() => {
        console.log('🧹 Clearing all filters');
        
        setSearchQuery('');
        setSelectedGenre('');
        
        resetBooks();
        setFilters({ page: 1, limit: 20 });
        loadBooks(true);
    }, [resetBooks, setFilters, loadBooks]);

    // Verificar si hay filtros activos localmente (antes de aplicar)
    const hasLocalFilters = searchQuery.trim() || selectedGenre;
    
    // Verificar si los filtros locales son diferentes a los aplicados
    const hasUnappliedChanges = 
        (searchQuery.trim() || '') !== (filters.search || '') ||
        selectedGenre !== (filters.genre || '');

    return {
        // Estados locales
        searchQuery,
        setSearchQuery: handleSearchChange,
        selectedGenre,
        setSelectedGenre: handleGenreChange,
        
        // Acciones
        handleSearch,
        handleClearFilters,
        
        // Estados útiles para la UI - ESTAS ERAN LAS QUE FALTABAN
        hasLocalFilters,
        hasUnappliedChanges
    };
}