'use client';

import { ChevronLeft, ChevronRight, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface BookViewerControlsProps {
    pageNumber: number;
    numPages: number;
    scale: number;
    onPrevPage: () => void;
    onNextPage: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onRotate: () => void;
    onPageChange: (page: number) => void;
}

export default function BookViewerControls({
    pageNumber,
    numPages,
    scale,
    onPrevPage,
    onNextPage,
    onZoomIn,
    onZoomOut,
    onRotate,
    onPageChange
}: BookViewerControlsProps) {
    return (
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
            <div className="flex items-center justify-between">
                {/* Navigation Controls */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onPrevPage}
                        disabled={pageNumber <= 1}
                        className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous page"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-300">Page</span>
                        <input
                            type="number"
                            min={1}
                            max={numPages}
                            value={pageNumber}
                            onChange={(e) => {
                                const page = parseInt(e.target.value);
                                if (page >= 1 && page <= numPages) {
                                    onPageChange(page);
                                }
                            }}
                            className="w-16 px-2 py-1 bg-gray-700 text-white rounded border border-gray-600 text-center"
                        />
                        <span className="text-gray-300">of {numPages}</span>
                    </div>

                    <button
                        onClick={onNextPage}
                        disabled={pageNumber >= numPages}
                        className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next page"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

                {/* Zoom and Rotation Controls */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onZoomOut}
                        className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                        aria-label="Zoom out"
                    >
                        <ZoomOut size={16} />
                    </button>

                    <span className="text-sm text-gray-300 w-12 text-center">
                        {Math.round(scale * 100)}%
                    </span>

                    <button
                        onClick={onZoomIn}
                        className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                        aria-label="Zoom in"
                    >
                        <ZoomIn size={16} />
                    </button>

                    <div className="h-4 w-px bg-gray-600 mx-2"></div>

                    <button
                        onClick={onRotate}
                        className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                        aria-label="Rotate"
                    >
                        <RotateCw size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}