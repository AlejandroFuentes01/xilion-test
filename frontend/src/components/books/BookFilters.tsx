'use client';

import { VALID_GENRES } from '@/types';
import { ChevronDown, Loader2, Search, X } from 'lucide-react';

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
                {/* Campo de búsqueda con indicador de búsqueda automática */}
                <div className="flex-1">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search books by title... (searches as you type)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                            className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            disabled={isLoading}
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        {/* Indicador de búsqueda activa */}
                        {isLoading && searchQuery && (
                            <Loader2 className="absolute right-3 top-2.5 h-4 w-4 text-blue-500 animate-spin" />
                        )}
                    </div>
                </div>

                {/* Filtro de género */}
                <div className="relative">
                    <select
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[150px] disabled:opacity-50"
                        disabled={isLoading}
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
                        {isLoading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Search size={16} />
                        )}
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

            {/* Indicador de filtros activos mejorado */}
            {hasActiveFilters && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Active filters:</span>
                    {searchQuery && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                            Search: "{searchQuery}"
                        </span>
                    )}
                    {selectedGenre && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                            Genre: {selectedGenre}
                        </span>
                    )}
                    <span className="text-xs text-gray-500">
                        • Search updates automatically as you type
                    </span>
                </div>
            )}

            {/* Indicador de búsqueda en progreso */}
            {isLoading && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Searching books...</span>
                </div>
            )}
        </div>
    );
}