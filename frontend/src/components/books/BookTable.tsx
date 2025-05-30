import { BookWithAuthor } from '@/types';
import BookTableRow from './BookTableRow';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';

// Propiedades del componente de tabla de libros
interface BookTableProps {
    books: BookWithAuthor[];       // Lista de libros con información del autor
    isLoading: boolean;            // Estado de carga
    hasNextPage: boolean;          // Si hay más páginas disponibles
    onLoadMore: () => void;        // Función para cargar más libros
    currentPage: number;           // Página actual
    limit: number;                 // Límite de libros por página
    hasFilters: boolean;           // Si hay filtros aplicados
    onClearFilters: () => void;    // Función para limpiar filtros
}

export default function BookTable({
    books,
    isLoading,
    hasNextPage,
    onLoadMore,
    currentPage,
    limit,
    hasFilters,
    onClearFilters
}: BookTableProps) {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Tabla principal con encabezados */}
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

            {/* Estado de carga inicial */}
            {isLoading && books.length === 0 && <LoadingState />}

            {/* Estado vacío cuando no hay libros */}
            {!isLoading && books.length === 0 && (
                <EmptyState hasFilters={hasFilters} onClearFilters={onClearFilters} />
            )}

            {/* Botón para cargar más libros */}
            {hasNextPage && books.length > 0 && (
                <div className="text-center py-6 border-t border-gray-200">
                    <button
                        onClick={onLoadMore}
                        disabled={isLoading}
                        className="bg-black text-white px-8 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Loading...
                            </span>
                        ) : (
                            'Load more'
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}