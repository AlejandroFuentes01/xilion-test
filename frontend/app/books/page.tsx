'use client';

import { useAuthStore } from '@/stores/authStore';
import { useBooksStore } from '@/stores/booksStore';
import { VALID_GENRES } from '@/types';
import { ChevronDown, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BooksPage() {
    const router = useRouter();
    const { isAuthenticated, user, logout } = useAuthStore();
    const { books, filters, isLoading, hasNextPage, setFilters, loadBooks, loadMoreBooks } = useBooksStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, router]);

    // Load books on mount
    useEffect(() => {
        if (isAuthenticated) {
            loadBooks();
        }
    }, [isAuthenticated, loadBooks]);

    // Handle search
    const handleSearch = () => {
        setFilters({
            search: searchQuery || undefined,
            genre: selectedGenre || undefined,
            page: 1
        });
        loadBooks();
    };

    // Handle load more
    const handleLoadMore = () => {
        loadMoreBooks();
    };

    if (!isAuthenticated) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <div className="bg-black text-white p-2 rounded-lg mr-3">
                                📚
                            </div>
                            <span className="text-xl font-semibold text-gray-900">Library</span>
                        </div>

                        {/* User menu */}
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
                            <button
                                onClick={logout}
                                className="text-sm text-red-600 hover:text-red-500"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Books</h1>
                    <p className="mt-1 text-sm text-gray-600">View and manage your library collection</p>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Genre Filter */}
                    <div className="relative">
                        <select
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Genres</option>
                            {VALID_GENRES.map(genre => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                    >
                        <Search size={16} />
                        Search
                    </button>
                </div>

                {/* Books Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published At</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {books.map((book, index) => (
                                <tr key={book.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                        #{(filters.page! - 1) * (filters.limit || 20) + index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {book.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {book.genre}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {book.publishedYear}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                        {book.author?.name || 'Unknown Author'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Loading State */}
                    {isLoading && books.length === 0 && (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            <p className="mt-2 text-sm text-gray-600">Loading books...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && books.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-sm text-gray-600">No books found</p>
                        </div>
                    )}

                    {/* Load More Button */}
                    {hasNextPage && books.length > 0 && (
                        <div className="text-center py-6 border-t border-gray-200">
                            <button
                                onClick={handleLoadMore}
                                disabled={isLoading}
                                className="bg-black text-white px-8 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                            >
                                {isLoading ? 'Loading...' : 'Load more'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}