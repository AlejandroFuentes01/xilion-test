import { BookWithAuthor } from '@/types';

/**
 * Verifica si un libro es "The Way of Kings" de Brandon Sanderson
 */
export function isTheWayOfKings(book: BookWithAuthor): boolean {
    return (
        book.title.toLowerCase().includes('the way of kings') ||
        book.title.toLowerCase().includes('way of kings')
    ) && (
        book.author?.name.toLowerCase().includes('brandon sanderson') ||
        book.author?.name.toLowerCase().includes('sanderson')
    );
}

/**
 * Verifica si un libro tiene visor PDF disponible
 */
export function hasBookViewer(book: BookWithAuthor): boolean {
    return isTheWayOfKings(book);
}

/**
 * Obtiene la URL del PDF para un libro específico
 */
export function getBookPdfUrl(book: BookWithAuthor): string | null {
    if (isTheWayOfKings(book)) {
        return '/books/the-way-of-kings.pdf';
    }
    return null;
}