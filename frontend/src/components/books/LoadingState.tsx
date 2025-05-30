export default function LoadingState() {
    return (
        <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-sm text-gray-600">Loading books...</p>
        </div>
    );
}