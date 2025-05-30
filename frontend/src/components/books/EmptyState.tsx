import { BookOpen } from 'lucide-react';

interface EmptyStateProps {
    hasFilters: boolean;
    onClearFilters?: () => void;
}

export default function EmptyState({ hasFilters, onClearFilters }: EmptyStateProps) {
    return (
        <div className="text-center py-16">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                {hasFilters ? 'No books match your search' : 'No books found'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
                {hasFilters
                    ? 'Try adjusting your search criteria or filters'
                    : 'There are no books in the library yet'
                }
            </p>
            {hasFilters && onClearFilters && (
                <button
                    onClick={onClearFilters}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                    Clear Filters
                </button>
            )}
        </div>
    );
}