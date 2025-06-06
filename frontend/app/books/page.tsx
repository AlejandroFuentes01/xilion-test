'use client';

import BookCards from '@/components/books/BookCards';
import BookFilters from '@/components/books/BookFilters';
import BookHeader from '@/components/books/BookHeader';
import BookTable from '@/components/books/BookTable';
import { useBookFilters } from '@/hooks/books/useBookFilters';
import { useInfiniteBooks } from '@/hooks/books/useInfiniteBooks';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useTableScroll } from '@/hooks/useTableScroll';
import { useBooksStore } from '@/stores/booksStore';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function BooksPage() {
    // Hooks existentes
    const { isAuthenticated } = useAuthRedirect();
    const { 
        books, 
        isLoading, 
        hasNextPage, 
        loadMoreBooks, 
        totalBooks,
        totalBooksInLibrary,
        hasFilters 
    } = useInfiniteBooks();
    
    const { 
        filters, 
        isLoadingMore, 
        error, 
        clearError
    } = useBooksStore();
    
    const {
        searchQuery,
        setSearchQuery,
        selectedGenre,
        setSelectedGenre,
        handleSearch,
        handleClearFilters,
        hasLocalFilters,
        hasUnappliedChanges
    } = useBookFilters();

    // Hook de scroll solo para la tabla (desktop)
    const {
        scrollRef,
        showScrollIndicator,
        canScrollLeft,
        canScrollRight,
        scrollToStart,
        scrollToEnd,
        hideIndicator
    } = useTableScroll({
        hideIndicatorAfterScroll: true,
        scrollThreshold: 20,
        rememberUserPreference: true
    });

    // Retorno temprano si no está autenticado
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <BookHeader />

            {/* Contenedor Principal - Padding y espaciado responsivo */}
            <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10">
                <div className="py-4 sm:py-6 md:py-8 lg:py-10">
                    {/* Encabezado de Página - Tipografía y espaciado responsivo */}
                    <div className="mb-4 sm:mb-6 md:mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                    Library
                                </h1>
                                <div className="mt-1 sm:mt-2">
                                    {totalBooksInLibrary > 0 && (
                                        <p className="text-xs sm:text-sm md:text-base text-gray-600">
                                            {totalBooksInLibrary.toLocaleString()} books
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Filtros - Responsivo con espaciado adecuado */}
                    <div className="mb-4 sm:mb-6 md:mb-8">
                        <BookFilters
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            selectedGenre={selectedGenre}
                            setSelectedGenre={setSelectedGenre}
                            onSearch={handleSearch}
                            onClear={handleClearFilters}
                            isLoading={isLoading}
                            hasLocalFilters={!!hasLocalFilters}
                            hasUnappliedChanges={hasUnappliedChanges}
                        />
                    </div>

                    {/* Books Display Section - Híbrido Cards/Tabla */}
                    <div className="w-full">
                        
                        {/* VISTA MÓVIL/TABLET: Cards (< 1024px) */}
                        <div className="block lg:hidden">
                            <BookCards
                                books={books}
                                isLoading={isLoading}
                                isLoadingMore={isLoadingMore}
                                hasNextPage={hasNextPage}
                                onLoadMore={loadMoreBooks}
                                hasFilters={hasFilters}
                                totalBooks={totalBooks}
                                error={error}
                                onClearError={clearError}
                            />
                        </div>

                        {/* VISTA DESKTOP: Tabla con Scroll (≥ 1024px) */}
                        <div className="hidden lg:block">
                            {/* Indicador de scroll inteligente para tabla */}
                            {showScrollIndicator && (
                                <div className="mb-3">
                                    <div className="bg-blue-50 border border-blue-200 text-blue-700 py-3 px-4 rounded-lg relative scroll-indicator">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-lg">👈</span>
                                                <span>Scroll horizontally to see more columns</span>
                                            </div>
                                            <button
                                                onClick={hideIndicator}
                                                className="text-blue-600 hover:text-blue-800 ml-2"
                                                aria-label="Hide scroll indicator"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Botones de navegación para tabla (opcional) */}
                            {(canScrollLeft || canScrollRight) && (
                                <div className="flex justify-between items-center mb-3">
                                    <button
                                        onClick={scrollToStart}
                                        disabled={!canScrollLeft}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                                            canScrollLeft
                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <ChevronLeft size={16} />
                                        Start
                                    </button>

                                    <div className="text-xs text-gray-500 px-3">
                                        Navigate table columns
                                    </div>

                                    <button
                                        onClick={scrollToEnd}
                                        disabled={!canScrollRight}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                                            canScrollRight
                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        End
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                            
                            {/* Contenedor con scroll horizontal optimizado */}
                            <div 
                                ref={scrollRef}
                                className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                                style={{ 
                                    WebkitOverflowScrolling: 'touch',
                                    scrollBehavior: 'smooth'
                                }}
                            >
                                {/* Wrapper que garantiza ancho mínimo */}
                                <div className="min-w-[900px] xl:min-w-0 table-content-enter">
                                    <BookTable
                                        books={books}
                                        isLoading={isLoading}
                                        isLoadingMore={isLoadingMore}
                                        hasNextPage={hasNextPage}
                                        onLoadMore={loadMoreBooks}
                                        currentPage={filters.page || 1}
                                        limit={filters.limit || 20}
                                        hasFilters={hasFilters}
                                        onClearFilters={handleClearFilters}
                                        totalBooks={totalBooks}
                                        error={error}
                                        onClearError={clearError}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}