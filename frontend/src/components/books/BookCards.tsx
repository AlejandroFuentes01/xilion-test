'use client';

import { BookWithAuthor } from '@/types';
import { Book, Calendar, Eye, Hash, Tag, User } from 'lucide-react';
interface BookCardsProps {
    books: BookWithAuthor[];
    isLoading: boolean;
    isLoadingMore: boolean;
    hasNextPage: boolean;
    onLoadMore: () => void;
    hasFilters: boolean;
    totalBooks: number;
    error?: string | null;
    onClearError?: () => void;
}

export default function BookCards({
    books,
    isLoading,
    isLoadingMore,
    hasNextPage,
    onLoadMore,
    hasFilters,
    totalBooks,
    error,
    onClearError
}: BookCardsProps) {

    // Función para limpiar valores inválidos
    const cleanValue = (value: any, fallback: string = 'Unknown'): string => {
        if (!value || value === '#N/A' || value === 'N/A' || value === '' || value === null || value === undefined || value === '#') {
            return fallback;
        }
        return String(value);
    };

    // Función para limpiar números (páginas, años, etc.)
    const cleanNumber = (value: any, fallback: string = 'Unknown'): string => {
        if (!value || value === '#N/A' || value === 'N/A' || value === '' || value === null || value === undefined || value === '#') {
            return fallback;
        }
        
        // Limpiar cualquier carácter no numérico al inicio
        const cleanedValue = String(value).replace(/^[#\s]+/, '').trim();
        const num = parseInt(cleanedValue);
        
        return isNaN(num) || num <= 0 ? fallback : String(num);
    };

    // Función para limpiar nombres de autores (quitar números al final)
    const cleanAuthorName = (authorName: any): string => {
        if (!authorName || authorName === '#N/A' || authorName === 'N/A' || authorName === '' || authorName === null || authorName === undefined || authorName === '#') {
            return 'Unknown Author';
        }
        
        const name = String(authorName);
        // Eliminar números y espacios al final del nombre
        const cleanName = name.replace(/\s+\d+\s*$/, '').trim();
        
        return cleanName || 'Unknown Author';
    };

    // Loading state para móviles
    if (isLoading && books.length === 0) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
                            <div className="flex gap-3">
                                <div className="w-14 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                    <div className="flex gap-1 mt-2">
                                        <div className="h-5 bg-gray-200 rounded-full w-12"></div>
                                        <div className="h-5 bg-gray-200 rounded-full w-10"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Empty state
    if (books.length === 0 && !isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <Book className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {hasFilters ? 'No books found' : 'No books available'}
                </h3>
                <p className="text-gray-500 text-sm">
                    {hasFilters 
                        ? 'Try adjusting your search criteria or clearing filters.'
                        : 'There are no books in the library yet.'
                    }
                </p>
                {hasFilters && onClearError && (
                    <button
                        onClick={onClearError}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                        Clear Filters
                    </button>
                )}
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <div className="text-red-600 mb-2 text-sm">⚠️ Error loading books</div>
                <p className="text-red-800 mb-4 text-sm">{error}</p>
                {onClearError && (
                    <button
                        onClick={onClearError}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                        Try Again
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Grid de Cards para móviles/tablets - Sin header confuso */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {books.map((book) => {
                    return (
                        <div 
                            key={book.id} 
                            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 overflow-hidden"
                        >
                            {/* Card Content */}
                            <div className="p-4">
                                <div className="flex gap-3">
                                    {/* Ícono de libro simple */}
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg border border-gray-200 flex items-center justify-center">
                                            <Book className="h-6 w-6 text-blue-600" />
                                        </div>
                                    </div>

                                    {/* Info del libro */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight mb-1">
                                            {cleanValue(book.title, 'Untitled Book')}
                                        </h3>
                                        
                                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                                            <User className="h-3 w-3 flex-shrink-0" />
                                            <span className="truncate">
                                                {cleanAuthorName(book.author?.name)}
                                            </span>
                                        </div>

                                        {/* Tags compactos */}
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {cleanValue(book.genre, '') !== '' && 
                                             cleanValue(book.genre, '') !== 'Unknown' && 
                                             cleanValue(book.genre, '').length > 1 ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    <Tag className="h-2.5 w-2.5" />
                                                    {cleanValue(book.genre, 'General')}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                                    <Tag className="h-2.5 w-2.5" />
                                                    General
                                                </span>
                                            )}
                                            
                                            {cleanValue(book.publishedYear, '') !== '' && 
                                             cleanNumber(book.publishedYear, '') !== 'Unknown' && 
                                             parseInt(cleanNumber(book.publishedYear, '0')) > 1800 && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                    <Calendar className="h-2.5 w-2.5" />
                                                    {cleanNumber(book.publishedYear, 'Unknown')}
                                                </span>
                                            )}
                                        </div>

                                        {/* Info adicional */}
                                        <div className="flex items-center justify-between">
                                            {/* Solo mostrar páginas si hay un número válido */}
                                            {(book as any).pages && cleanNumber((book as any).pages, '') !== '' && cleanNumber((book as any).pages, '') !== 'Unknown' && (
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Hash className="h-3 w-3" />
                                                    <span>{cleanNumber((book as any).pages, '?')} pages</span>
                                                </div>
                                            )}
                                            
                                            <button className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 ml-auto">
                                                <Eye className="h-3 w-3" />
                                                <span>View</span>
                                            </button>
                                        </div>

                                        {/* ISBN muy pequeño - solo si existe y es válido */}
                                        {(book as any).isbn && cleanValue((book as any).isbn, '') !== '' && 
                                         cleanValue((book as any).isbn, '') !== 'Unknown' && 
                                         cleanValue((book as any).isbn, '').length > 3 && (
                                            <div className="text-xs text-gray-400 font-mono mt-1 truncate">
                                                {cleanValue((book as any).isbn, '')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Load more button */}
            {hasNextPage && (
                <div className="flex justify-center py-6">
                    <button
                        onClick={onLoadMore}
                        disabled={isLoadingMore}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm"
                    >
                        {isLoadingMore ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Loading...
                            </>
                        ) : (
                            <>
                                <Book className="h-4 w-4" />
                                Load More Books
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Loading more cards */}
            {isLoadingMore && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2].map(i => (
                        <div key={`loading-${i}`} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
                            <div className="flex gap-3">
                                <div className="w-14 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* End message */}
            {!hasNextPage && books.length > 0 && (
                <div className="text-center py-6">
                    <div className="text-gray-500 text-xs">
                        📚 End of {hasFilters ? 'filtered' : ''} book collection
                    </div>
                </div>
            )}
        </div>
    );
}