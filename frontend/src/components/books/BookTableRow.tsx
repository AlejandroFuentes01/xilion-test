import { BookWithAuthor } from '@/types';
import { useRouter } from 'next/navigation';

// Propiedades del componente de fila de tabla
interface BookTableRowProps {
    book: BookWithAuthor;
    index: number;
    page: number;
    limit: number;
}

// Función para limpiar nombres de autores (remueve números al final)
const cleanAuthorName = (name: string): string => {
    return name.replace(/\s+\d+$/, '').trim();
};

export default function BookTableRow({ book, index, page, limit }: BookTableRowProps) {
    const router = useRouter();
    
    // Calcular índice global considerando paginación
    const displayIndex = (page - 1) * limit + index + 1;

    const handleRowClick = () => {
        router.push(`/books/${book.id}`);
    };

    const cleanedAuthorName = book.author?.name ? cleanAuthorName(book.author.name) : 'Unknown Author';

    return (
        <tr
            className="hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={handleRowClick}
        >
            {/* Índice */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                #{displayIndex}
            </td>
            
            {/* Título */}
            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                <div className="max-w-xs truncate" title={book.title}>
                    {book.title}
                </div>
            </td>
            
            {/* Género */}
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {book.genre}
                </span>
            </td>
            
            {/* Año de publicación */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {book.publishedYear}
            </td>
            
            {/* Autor */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                <div className="max-w-xs truncate" title={cleanedAuthorName}>
                    {cleanedAuthorName}
                </div>
            </td>
        </tr>
    );
}