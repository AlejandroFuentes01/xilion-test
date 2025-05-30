import { BookWithAuthor } from '@/types';
import { Loader2 } from 'lucide-react';
import BookTableRow from './BookTableRow';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';

// Propiedades del componente de tabla de libros
interface BookTableProps {
    books: BookWithAuthor[];       // Lista de libros con información del autor
    isLoading: boolean;            // Estado de carga inicial
    isLoadingMore?: boolean;       // Estado de carga de más elementos
    hasNextPage: boolean;          // Si hay más páginas disponibles
    onLoadMore: () => void;        // Función para cargar más libros
    currentPage: number;           // Página actual
    limit: number;                 // Límite de libros por página
    hasFilters: boolean;           // Si hay filtros aplicados
    onClearFilters: () => void;    // Función para limpiar filtros
    totalBooks?: number;           // Total de libros cargados
    error?: string | null;         // Error si existe
    onClearError?: () => void;     // Función para limpiar error
}

export default function BookTable({
    books,
    isLoading,
    isLoadingMore = false,
    hasNextPage,
    onLoadMore,
    currentPage,
    limit,
    hasFilters,
    onClearFilters,
    totalBooks,
    error,
    onClearError
}: BookTableProps) {
    // Mostrar error si existe
    if (error) {
        return (
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="text-center py-12">
                    <div className="text-red-600 mb-4">
                        <p className="font-medium">Error loading books</p>
                        <p className="text-sm">{error}</p>
                    </div>
                    <div className="space-x-2">
                        {onClearError && (
                            <button
                                onClick={onClearError}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Try Again
                            </button>
                        )}
                        {hasFilters && (
                            <button
                                onClick={onClearFilters}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Información de resultados */}
            {totalBooks !== undefined && !isLoading && books.length > 0 && (
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                    <p className="text-sm text-gray-600">
                        Showing {totalBooks} books
                        {hasNextPage && ' (scroll down for more)'}
                        {hasFilters && ' matching your search'}
                    </p>
                </div>
            )}

            {/* Tabla principal con encabezados */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Genre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Published At
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Author
                            </th>
                        </tr>
                    </thead>
                    {/* Cuerpo de la tabla con filas de libros */}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {books.map((book, index) => (
                            <BookTableRow
                                key={book.id}
                                book={book}
                                index={index}
                                page={currentPage}
                                limit={limit}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Estado de carga inicial */}
            {isLoading && totalBooks === 0 && <LoadingState />}

            {/* Estado vacío cuando no hay libros */}
            {!isLoading && totalBooks === 0 && (
                <EmptyState hasFilters={hasFilters} onClearFilters={onClearFilters} />
            )}

            {/* Indicador de carga de más elementos (infinite scroll) */}
            {isLoadingMore && totalBooks !== undefined && totalBooks > 0 && (
                <div className="text-center py-6 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-sm">Loading more books...</span>
                    </div>
                </div>
            )}

            {/* Botón manual para cargar más (backup del infinite scroll) */}
            {hasNextPage && totalBooks !== undefined && totalBooks > 0 && !isLoadingMore && (
                <div className="text-center py-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mt-2">
                        Keep Scrolling for More Books
                    </p>
                </div>
            )}

            {/* Indicador de final */}
            {!hasNextPage && books.length > 0 && !isLoading && (
                <div className="text-center py-6 border-t border-gray-200 bg-gray-50">
                    <p className="text-sm text-gray-600">
                        🎉 You've reached the end! All {totalBooks} books loaded.
                    </p>
                </div>
            )}
        </div>
    );
}