'use client';

import BookDetailsLoading from '@/components/books/BookDetailsLoading';
import BookReader from '@/components/books/BookReader';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { booksService } from '@/services/api';
import { AuthorWithStats, BookWithAuthor } from '@/types';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BookDetailsPage() {
    const params = useParams();
    const { isAuthenticated } = useAuthRedirect();

    const [bookData, setBookData] = useState<{
        book: BookWithAuthor;
        author: AuthorWithStats;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const bookId = params.id as string;

    useEffect(() => {
        if (!isAuthenticated || !bookId) return;

        const loadBookDetails = async () => {
            try {
                setIsLoading(true);
                setError(null);
                // Cargar datos completos (libro + autor)
                const data = await booksService.getBookDetails(bookId);
                setBookData(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load book');
            } finally {
                setIsLoading(false);
            }
        };

        loadBookDetails();
    }, [isAuthenticated, bookId]);

    if (!isAuthenticated) return null;

    if (isLoading) {
        return <BookDetailsLoading />;
    }

    if (error || !bookData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || 'Book not found'}</p>
                    <a href="/books" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                        Back to Books
                    </a>
                </div>
            </div>
        );
    }

    // Crear libro con autor incluido
    const bookWithAuthor: BookWithAuthor = {
        ...bookData.book,
        author: bookData.author
    };

    return <BookReader book={bookWithAuthor} />;
}