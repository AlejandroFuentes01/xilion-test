'use client';

import { useAuthStore } from '@/stores/authStore';

// Componente de header para las páginas de libros
export default function BookHeader() {
    const { user, logout } = useAuthStore();

    return (
        <div className="bg-white border-b border-gray-200">
            {/* Header de ancho completo */}
            <div className="w-full px-6 sm:px-8 lg:px-12">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - Lado izquierdo */}
                    <div className="flex items-center">
                        <div className="bg-black text-white p-2 rounded-lg mr-3">
                            📚
                        </div>
                        <span className="text-xl font-semibold text-gray-900">Library</span>
                    </div>

                    {/* Menú de usuario - Lado derecho */}
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">{user?.username}</span>
                        <button
                            onClick={logout}
                            className="text-sm text-red-600 hover:text-red-500 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}