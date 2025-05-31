import { BookWithAuthor } from '@/types';
import { ArrowLeft, Book, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BookHeader from './BookHeader';

interface BookReaderProps {
    book: BookWithAuthor;
}

// Función para limpiar nombres de autores (remueve números al final)
const cleanAuthorName = (name: string): string => {
    return name.replace(/\s+\d+$/, '').trim();
};

export default function BookReader({ book }: BookReaderProps) {
    const router = useRouter();

    const cleanedAuthorName = book.author?.name ? cleanAuthorName(book.author.name) : 'Unknown Author';

    // Verificar si es "The Way of Kings" para mostrar contenido especial
    const isWayOfKings = book.title.toLowerCase().includes('way of kings') &&
        cleanedAuthorName.toLowerCase().includes('brandon sanderson');

        // GG no tuve tiempo de hacerlo de otra manera
    const renderContent = () => {
        if (isWayOfKings) {
            const pdfUrl = '/books/the-way-of-kings.pdf';
            
            return (
                <div className="space-y-6">
                    {/* Botón para abrir PDF en web */}
                    <div className="text-center py-6">
                        <button
                            onClick={() => window.open(pdfUrl, '_blank')}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            <ExternalLink size={18} />
                            Abrir en Web
                        </button>
                    </div>

                    {/* Resumen del libro */}
                    <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                        <h4 className="text-xl font-semibold text-gray-900 mb-4">
                            Book Summary
                        </h4>
                        
                        <p className="mb-4">
                            Set on the storm-ravaged world of Roshar, "The Way of Kings" is an epic fantasy that follows three main characters: Kaladin, a former soldier turned slave; Shallan, a young woman seeking to save her family; and Dalinar, a warlord haunted by visions of ancient times.
                        </p>

                        <p className="mb-4">
                            Roshar is a world of stone and storms, where violent tempests reshape the landscape. Ancient magical artifacts known as Shardblades and Shardplate make their wielders nearly unstoppable in battle.
                        </p>

                        <p>
                            This is the first book in The Stormlight Archive series, an epic fantasy adventure with complex magic systems, deep character development, and incredibly detailed world-building spanning approximately 1,000 pages.
                        </p>
                    </div>
                </div>
            );
        }

        // Para otros libros - mostrar líneas grises (placeholder)
        return (
            <div className="space-y-4">
                {/* Simular líneas de texto con barras grises */}
                {[...Array(20)].map((_, index) => (
                    <div key={index} className="space-y-2">
                        {/* Línea larga */}
                        <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                        {/* Línea mediana */}
                        <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
                        {/* Línea corta */}
                        <div className="h-4 bg-gray-300 rounded w-4/5 animate-pulse"></div>
                        {/* Línea muy corta */}
                        <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
                        {/* Salto de párrafo */}
                        <div className="h-2"></div>
                    </div>
                ))}

                <div className="mt-12 p-6 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-center text-gray-600 font-medium flex items-center justify-center gap-2">
                        <Book size={20} />
                        Content not available for reading
                    </p>
                    <p className="text-center text-sm text-gray-500 mt-2">
                        This book is catalogued in our library but not available for online reading.
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Usar el mismo header que la página de libros */}
            <BookHeader />

            {/* Contenido del libro */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Botón de regreso */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push('/books')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    >
                        <ArrowLeft size={16} />
                        Back to Books
                    </button>
                </div>

                {/* Título y autor del libro - SIEMPRE reales */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 leading-tight">
                        {book.title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600">
                        by {cleanedAuthorName}
                    </p>
                    
                    {/* Información adicional */}
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="bg-gray-100 px-3 py-1 rounded-full">
                            📚 {book.genre}
                        </span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full">
                            📅 Published {book.publishedYear}
                        </span>
                        {isWayOfKings && (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                                📖 Available for Reading
                            </span>
                        )}
                    </div>
                </div>

                {/* Contenido del libro */}
                <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}