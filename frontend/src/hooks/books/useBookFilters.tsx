'use client';

import { useBooksStore } from '@/stores/booksStore';
import { useCallback, useState } from 'react';

export function useBookFilters() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const { setFilters, loadBooks } = useBooksStore();

    const handleSearch = useCallback(() => {
        setFilters({
            search: searchQuery || undefined,
            genre: selectedGenre || undefined,
            page: 1
        });
        loadBooks();
    }, [searchQuery, selectedGenre, setFilters, loadBooks]);

    const handleClearFilters = useCallback(() => {
        setSearchQuery('');
        setSelectedGenre('');
        setFilters({ page: 1 });
        loadBooks();
    }, [setFilters, loadBooks]);

    return {
        searchQuery,
        setSearchQuery,
        selectedGenre,
        setSelectedGenre,
        handleSearch,
        handleClearFilters
    };
}