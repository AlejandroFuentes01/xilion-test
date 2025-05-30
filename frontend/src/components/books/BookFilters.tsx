'use client';

import { VALID_GENRES } from '@/types';
import { ChevronDown, Search, X } from 'lucide-react';

// Propiedades del componente de filtros
interface BookFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedGenre: string;
    setSelectedGenre: (genre: string) => void;
    onSearch: () => void;
    onClear: () => void;
    isLoading: boolean;
}

export default function BookFilters({
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    onSearch,
    onClear,
    isLoading
}: BookFiltersProps) {
    // Verificar si hay filtros activos
    const hasActiveFilters = searchQuery || selectedGenre;

    return (
        <div className="mb-6 space-y-4">
            {/* Barra de búsqueda y filtros */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Campo de búsqueda */}
                <div className="flex-1">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search books by title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                </div>

                {/* Filtro de género */}
                <div className="relative">
                    <select
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[150px]"
                    >
                        <option value="">All Genres</option>
                        {VALID_GENRES.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                    <button
                        onClick={onSearch}
                        disabled={isLoading}
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                    >
                        <Search size={16} />
                        Search
                    </button>

                    {hasActiveFilters && (
                        <button
                            onClick={onClear}
                            disabled={isLoading}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                        >
                            <X size={16} />
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Indicador de filtros activos */}
            {hasActiveFilters && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Active filters:</span>
                    {searchQuery && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Search: "{searchQuery}"
                        </span>
                    )}
                    {selectedGenre && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            Genre: {selectedGenre}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}