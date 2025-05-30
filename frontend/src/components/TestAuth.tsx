'use client';

import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';
import AuthModal from './auth/AuthModal';

export default function TestAuth() {
    const [showModal, setShowModal] = useState(false);
    const { user, isAuthenticated, logout } = useAuthStore();

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Authentication Test</h3>

            {isAuthenticated ? (
                <div className="space-y-2">
                    <div className="text-green-600">
                        ✅ Logged in as: <span className="font-semibold">{user?.username}</span>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="text-gray-600">Not authenticated</div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Login / Register
                    </button>
                </div>
            )}

            <AuthModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        </div>
    );
}