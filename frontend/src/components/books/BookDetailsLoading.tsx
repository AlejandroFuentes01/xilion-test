// Componente de loading para la página de detalles de libros
export default function BookDetailsLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Skeleton del header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="bg-gray-200 p-2 rounded-lg mr-3 animate-pulse w-10 h-10"></div>
                            <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Skeleton del contenido */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Skeleton del título */}
                <div className="mb-8">
                    <div className="h-12 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Skeleton del contenido del libro */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="space-y-4">
                        {[...Array(15)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                                <div className="h-2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}