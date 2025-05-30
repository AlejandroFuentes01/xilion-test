import { BookWithAuthor } from '@/types';
import BookTableRow from './BookTableRow';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';

interface BookTableProps {
    books: BookWithAuthor[];
    isLoading: boolean;
    hasNextPage: boolean;
    onLoadMore: () => void;
    currentPage: number;
    limit: number;
    hasFilters: boolean;
    onClearFilters: () => void;
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

            {/* Loading State */}
            {isLoading && books.length === 0 && <LoadingState />}

            {/* Empty State */}
            {!isLoading && books.length === 0 && (
                <EmptyState hasFilters={hasFilters} onClearFilters={onClearFilters} />
            )}

            {/* Load More Button */}
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