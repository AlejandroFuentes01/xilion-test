import { AuthorWithStats, BookWithAuthor } from '@/types';
import { Award, BookOpen, Calendar, Globe, Tag, TrendingUp } from 'lucide-react';

// Propiedades del componente de contenido de detalles del libro
interface BookDetailsContentProps {
    book: BookWithAuthor;
    author: AuthorWithStats;
}

export default function BookDetailsContent({ book, author }: BookDetailsContentProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda - Información del libro */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Book Information</h2>

                <div className="space-y-6">
                    {/* Información básica */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Published Year</p>
                                <p className="font-semibold text-gray-900">{book.publishedYear}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <Tag className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Genre</p>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                    {book.genre}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ID del libro */}
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <BookOpen className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Book ID</p>
                            <p className="font-mono text-sm text-gray-700">{book.id}</p>
                        </div>
                    </div>

                    {/* Línea de tiempo de publicación */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Publication Timeline</h3>
                        <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                            <div className="relative flex items-center gap-4">
                                <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center">
                                    <Calendar className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Published</p>
                                    <p className="text-sm text-gray-500">{book.publishedYear}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Columna derecha - Información del autor */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Author Information</h2>

                <div className="space-y-6">
                    {/* Información básica del autor */}
                    <div className="text-center pb-6 border-b">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-white">
                                {author.name.split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{author.name}</h3>
                        <p className="text-gray-600">Author</p>
                    </div>

                    {/* Estadísticas del autor */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <Calendar className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Birth Year</p>
                                <p className="font-semibold text-gray-900">{author.birthYear}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-red-100 p-2 rounded-lg">
                                <Globe className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Nationality</p>
                                <p className="font-semibold text-gray-900">{author.nationality}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 p-2 rounded-lg">
                                <BookOpen className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Books</p>
                                <p className="font-semibold text-gray-900">{author.booksCount}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-yellow-100 p-2 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Avg. Pub. Year</p>
                                <p className="font-semibold text-gray-900">
                                    {author.averagePublicationYear ? Math.round(author.averagePublicationYear) : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Puntuación de impacto del autor */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-yellow-500 p-2 rounded-lg">
                                <Award className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Author Impact Score</h3>
                                <p className="text-sm text-gray-600">Calculated impact metric</p>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-4xl font-bold text-yellow-600 mb-2">
                                {author.authorImpactScore || 'N/A'}
                            </div>
                            <p className="text-sm text-gray-600">
                                Formula: (Total Books × 10) + (Current Year - Avg Publication Year)
                            </p>
                        </div>
                    </div>

                    {/* Información adicional del autor */}
                    <div className="border-t pt-6">
                        <h4 className="font-medium text-gray-900 mb-3">Author Bio</h4>
                        <div className="text-sm text-gray-600 space-y-2">
                            <p>• Born in {author.birthYear}</p>
                            <p>• Nationality: {author.nationality}</p>
                            <p>• Has written {author.booksCount} books</p>
                            <p>• Average publication year: {author.averagePublicationYear ? Math.round(author.averagePublicationYear) : 'Unknown'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}