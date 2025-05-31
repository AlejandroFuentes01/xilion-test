'use client';

import { AuthorWithStats, BookWithAuthor } from '@/types';
import { useCallback, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import BookViewerControls from './BookViewerControls';
import BookViewerHeader from './BookViewerHeader';

// Configurar worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface BookViewerProps {
    book: BookWithAuthor;
    author?: AuthorWithStats;
    onClose: () => void;
}

export default function BookViewer({ book, author, onClose }: BookViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);
    const [rotation, setRotation] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // URL del PDF (solo para "The Way of Kings")
    const pdfUrl = '/books/the-way-of-kings.pdf';

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setIsLoading(false);
        setError(null);
    }, []);

    const onDocumentLoadError = useCallback((error: Error) => {
        console.error('Error loading PDF:', error);
        setError('Failed to load the book. Please try again.');
        setIsLoading(false);
    }, []);

    const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages));
    const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
    const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
    const rotate = () => setRotation(prev => (prev + 90) % 360);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">Error Loading Book</h2>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <button
                        onClick={onClose}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Back to Library
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <BookViewerHeader 
                book={book}
                author={author}
                onClose={onClose}
                onDownload={() => window.open(pdfUrl, '_blank')}
            />

            {/* Controls */}
            <BookViewerControls
                pageNumber={pageNumber}
                numPages={numPages}
                scale={scale}
                onPrevPage={goToPrevPage}
                onNextPage={goToNextPage}
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                onRotate={rotate}
                onPageChange={setPageNumber}
            />

            {/* PDF Viewer */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
                {isLoading && (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                        <p>Loading "The Way of Kings"...</p>
                    </div>
                )}

                <div className="bg-white shadow-2xl">
                    <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={null}
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            rotate={rotation}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    </Document>
                </div>
            </div>
        </div>
    );
}