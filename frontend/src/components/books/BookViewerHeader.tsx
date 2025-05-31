'use client';

import { AuthorWithStats, BookWithAuthor } from '@/types';
import { ArrowLeft, Download } from 'lucide-react';

interface BookViewerHeaderProps {
    book: BookWithAuthor;
    author?: AuthorWithStats;
    onClose: () => void;
    onDownload: () => void;
}

export default function BookViewerHeader({ book, author, onClose, onDownload }: BookViewerHeaderProps) {
    return (
        <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onClose}
                        className="flex items-center text-gray-300 hover:text-white transition-colors"
                        aria-label="Back to library"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Library
                    </button>
                    
                    <div className="h-6 w-px bg-gray-600"></div>
                    
                    <div>
                        <h1 className="text-lg font-semibold text-white truncate">
                            {book.title}
                        </h1>
                        {author && (
                            <p className="text-sm text-gray-400">
                                by {author.name}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={onDownload}
                        className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                        <Download size={16} className="mr-2" />
                        Download
                    </button>
                </div>
            </div>
        </header>
    );
}