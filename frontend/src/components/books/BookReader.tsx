import { BookWithAuthor } from '@/types';
import { ArrowLeft, Book } from 'lucide-react';
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

    // Debug temporal
    console.log('BookReader - raw author name:', book.author?.name);
    console.log('BookReader - cleaned author name:', cleanedAuthorName);

    // Verificar si es "The Way of Kings" para mostrar contenido especial
    const isWayOfKings = book.title.toLowerCase().includes('way of kings') &&
        cleanedAuthorName.toLowerCase().includes('brandon sanderson');

    const renderContent = () => {
        if (isWayOfKings) {
            return (
                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                    <div className="space-y-6">
                        <p className="text-xl font-medium text-gray-900 mb-8">
                            Chapter 1: To Kill
                        </p>

                        <p>
                            "I'm going to destroy you," Kaladin said quietly, watching the lighteyes across from him. The man was a highlord, judging by his clothing—a pristine blue silk coat that probably cost more than most people made in a year.
                        </p>

                        <p>
                            The lighteyes laughed. "You? A darkeyed slave thinks he can destroy me?" He gestured, and his guards stepped forward. "I am Brightlord Amaram, heir to one of Alethkar's most ancient houses. You are nothing."
                        </p>

                        <p>
                            Kaladin's grip tightened on his spear. The weapon felt familiar in his hands, despite the months of slavery. "We'll see about that, Brightlord."
                        </p>

                        <p>
                            The wind picked up around them, carrying with it the faint scent of a distant storm. In the sky above, the occasional windspren danced through the air, like tiny glowing ribbons caught in an invisible breeze.
                        </p>

                        <p>
                            "The most important step a man can take," Kaladin whispered to himself, words his father had once told him, "is always the next one."
                        </p>

                        <p>
                            And with that, he charged forward, his spear gleaming in the afternoon light, ready to face whatever destiny awaited him on the Shattered Plains of Roshar.
                        </p>

                        <div className="mt-12 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800 font-medium">
                                📚 Continue reading "The Way of Kings" - This is just the beginning of an epic fantasy journey through the world of Roshar.
                            </p>
                        </div>
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
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                        {/* Línea mediana */}
                        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                        {/* Línea corta */}
                        <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                        {/* Línea muy corta */}
                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                        {/* Salto de párrafo */}
                        <div className="h-2"></div>
                    </div>
                ))}

                <div className="mt-12 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                        <Book size={16} />
                        Content not available - This is a placeholder for "{book.title}"
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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Botón de regreso - Posicionado antes del título */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push('/books')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    >
                        <ArrowLeft size={16} />
                        Back to Books
                    </button>
                </div>

                {/* Título y autor del libro */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                        {book.title}
                    </h1>
                    <p className="text-xl text-gray-600">
                        {cleanedAuthorName}
                    </p>
                </div>

                {/* Contenido del libro */}
                <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}