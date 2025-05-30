'use client';

import { useAuthStore } from '@/stores/authStore';

export default function BookHeader() {
    const { user, logout } = useAuthStore();

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="bg-black text-white p-2 rounded-lg mr-3">
                            📚
                        </div>
                        <span className="text-xl font-semibold text-gray-900">Library</span>
                    </div>

                    {/* User menu */}
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
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