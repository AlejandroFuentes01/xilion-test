'use client';

import { useBooksStore } from '@/stores/booksStore';
import { useEffect } from 'react';

export function useInfiniteBooks() {
    const {
        books,
        isLoading,
        hasNextPage,
        loadBooks,
        loadMoreBooks
    } = useBooksStore();

    useEffect(() => {
        if (books.length === 0) {
            loadBooks();
        }
    }, [books.length, loadBooks]);

    return {
        books,
        isLoading,
        hasNextPage,
        loadMoreBooks
    };
}