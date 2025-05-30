'use client';

import { VALID_GENRES } from '@/types';
import { AlertCircle, ChevronDown, Search, X } from 'lucide-react';
import { useRef } from 'react';

// Propiedades del componente de filtros
interface BookFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedGenre: string;
    setSelectedGenre: (genre: string) => void;
    onSearch: () => void;
    onClear: () => void;
    isLoading: boolean;
    hasLocalFilters?: boolean;
    hasUnappliedChanges?: boolean;
}

//Goku SuperSayajin 4
export default function BookFilters({
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    onSearch,
    onClear,
    isLoading,
    hasLocalFilters = false,
    hasUnappliedChanges = false
}: BookFiltersProps) {
    // Ref para mantener focus del input
    const inputRef = useRef<HTMLInputElement>(null);

    // Manejar Enter en el input
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSearch();
        }
    };

    // Manejar cambio en input de búsqueda - Simplificado
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Verificar si el botón Search debe estar habilitado
    const canSearch = hasLocalFilters && !isLoading;

    return (
        <div className="w-full space-y-3 sm:space-y-4">
            {/* Barra de búsqueda y filtros - Layout totalmente responsive */}
            <div className="flex flex-col space-y-3 lg:flex-row lg:space-y-0 lg:space-x-4">
                {/* Campo de búsqueda - Toma el espacio principal */}
                <div className="flex-1 min-w-0">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search books by title..."
                            value={searchQuery}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 pl-9 sm:pl-10 
                                     text-sm sm:text-base
                                     border border-gray-300 rounded-lg 
                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                     transition-colors placeholder:text-gray-400
                                     disabled:bg-gray-50 disabled:text-gray-500"
                            disabled={isLoading}
                            autoComplete="off"
                            spellCheck="false"
                        />
                        <Search className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 h-4 w-4 text-gray-400" />
                    </div>
                </div>

                {/* Container para filtro y botones - Se apila en móvil, fila en desktop */}
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 lg:space-x-4">
                    {/* Filtro de género */}
                    <div className="relative sm:min-w-[160px] lg:min-w-[180px]">
                        <select
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="w-full appearance-none bg-white border border-gray-300 rounded-lg 
                                     px-3 py-2.5 sm:px-4 sm:py-3 pr-8 sm:pr-10 
                                     text-sm sm:text-base
                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                     transition-colors disabled:opacity-50 disabled:bg-gray-50"
                            disabled={isLoading}
                        >
                            <option value="">All Genres</option>
                            {VALID_GENRES.map(genre => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 sm:right-3 top-3 sm:top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Botones de acción - Se apilan en móvil muy pequeño, fila en el resto */}
                    <div className="flex flex-col space-y-2 xs:flex-row xs:space-y-0 xs:space-x-2 sm:space-x-3">
                        <button
                            onClick={onSearch}
                            disabled={!canSearch}
                            className={`flex-1 xs:flex-none px-4 py-2.5 sm:px-6 sm:py-3 
                                      rounded-lg font-medium text-sm sm:text-base
                                      flex items-center justify-center gap-2 
                                      transition-colors min-w-[100px] sm:min-w-[120px]
                                      ${canSearch
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <Search size={16} className="flex-shrink-0" />
                            <span className="hidden xs:inline">
                                {isLoading ? 'Searching...' : 'Search'}
                            </span>
                            <span className="xs:hidden">
                                {isLoading ? '...' : 'Search'}
                            </span>
                        </button>

                        {hasLocalFilters && (
                            <button
                                onClick={onClear}
                                disabled={isLoading}
                                className="flex-1 xs:flex-none bg-gray-500 text-white 
                                         px-4 py-2.5 sm:px-5 sm:py-3 
                                         rounded-lg hover:bg-gray-600 active:bg-gray-700
                                         disabled:opacity-50 disabled:cursor-not-allowed 
                                         flex items-center justify-center gap-2 
                                         transition-colors text-sm sm:text-base
                                         min-w-[80px] sm:min-w-[100px]"
                            >
                                <X size={16} className="flex-shrink-0" />
                                <span className="hidden sm:inline">Clear</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Indicador de cambios sin aplicar - Responsive */}
            {hasUnappliedChanges && !isLoading && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm 
                              bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                        <span className="text-amber-800">
                            You have unapplied filter changes.
                        </span>
                    </div>
                    <button
                        onClick={onSearch}
                        className="text-amber-900 underline font-medium hover:text-amber-700 
                                 transition-colors text-left sm:text-center"
                    >
                        Click here to search or press Enter
                    </button>
                </div>
            )}

            {/* Indicador de filtros activos aplicados - Responsive */}
            {hasLocalFilters && !hasUnappliedChanges && (
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Active filters:</span>

                    <div className="flex flex-wrap gap-2">
                        {searchQuery.trim() && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 sm:px-3 sm:py-1 
                                           rounded-full text-xs sm:text-sm font-medium
                                           break-all max-w-[200px] sm:max-w-none">
                                Search: "{searchQuery.trim()}"
                            </span>
                        )}
                        {selectedGenre && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 sm:px-3 sm:py-1 
                                        rounded-full text-xs sm:text-sm font-medium">
                                Genre: {selectedGenre}
                            </span>
                        )}
                    </div>

                    <span className="text-xs text-gray-500 w-full sm:w-auto mt-1 sm:mt-0">
                        • Manual search only
                    </span>
                </div>
            )}

            {/* Instrucciones para usuarios nuevos - Responsive */}
            {!hasLocalFilters && !isLoading && (
                <div className="text-center py-3 sm:py-4">
                    <p className="text-sm sm:text-base text-gray-500 px-2">
                        <span className="block sm:inline">💡 Enter search terms and/or select a genre,</span>{' '}
                        <span className="block sm:inline mt-1 sm:mt-0">
                            then click <strong>Search</strong> or press <strong>Enter</strong>
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}