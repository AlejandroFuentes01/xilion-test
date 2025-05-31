'use client';

import { booksService } from '@/services/api';
import { AuthorWithStats, BookWithAuthor } from '@/types';
import { useEffect, useState } from 'react';

export function useBookDetails(bookId: string) {
    const [book, setBook] = useState<BookWithAuthor | null>(null);
    const [author, setAuthor] = useState<AuthorWithStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!bookId) return;

        const fetchBookDetails = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const response = await booksService.getBookDetails(bookId);
                setBook(response.book);
                setAuthor(response.author);
            } catch (err: any) {
                console.error('Error fetching book details:', err);
                setError(err.response?.data?.message || 'Failed to load book details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookDetails();
    }, [bookId]);

    return {
        book,
        author,
        isLoading,
        error
    };
}