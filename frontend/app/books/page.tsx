'use client';

import BookFilters from '@/components/books/BookFilters';
import BookHeader from '@/components/books/BookHeader';
import BookTable from '@/components/books/BookTable';
import { useBookFilters } from '@/hooks/books/useBookFilters';
import { useInfiniteBooks } from '@/hooks/books/useInfiniteBooks';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useBooksStore } from '@/stores/booksStore';

export default function BooksPage() {
    // Hooks
    const { isAuthenticated } = useAuthRedirect();
    const { books, isLoading, hasNextPage, loadMoreBooks } = useInfiniteBooks();
    const { filters } = useBooksStore();
    const {
        searchQuery,
        setSearchQuery,
        selectedGenre,
        setSelectedGenre,
        handleSearch,
        handleClearFilters
    } = useBookFilters();

    // Early return if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    const hasActiveFilters = Boolean(searchQuery || selectedGenre);

    return (
        <div className="min-h-screen bg-gray-50">
            <BookHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Books</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        View and manage your library collection
                    </p>
                </div>

                {/* Filters */}
                <BookFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedGenre={selectedGenre}
                    setSelectedGenre={setSelectedGenre}
                    onSearch={handleSearch}
                    onClear={handleClearFilters}
                    isLoading={isLoading}
                />

                {/* Books Table */}
                <BookTable
                    books={books}
                    isLoading={isLoading}
                    hasNextPage={hasNextPage}
                    onLoadMore={loadMoreBooks}
                    currentPage={filters.page || 1}
                    limit={filters.limit || 20}
                    hasFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                />
            </div>
        </div>
    );
}