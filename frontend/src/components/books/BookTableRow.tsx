import { BookWithAuthor } from '@/types';

interface BookTableRowProps {
    book: BookWithAuthor;
    index: number;
    page: number;
    limit: number;
}

export default function BookTableRow({ book, index, page, limit }: BookTableRowProps) {
    const displayIndex = (page - 1) * limit + index + 1;

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                #{displayIndex}
            </td>
            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                <div className="max-w-xs truncate" title={book.title}>
                    {book.title}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {book.genre}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {book.publishedYear}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                <div className="max-w-xs truncate" title={book.author?.name}>
                    {book.author?.name || 'Unknown Author'}
                </div>
            </td>
        </tr>
    );
}