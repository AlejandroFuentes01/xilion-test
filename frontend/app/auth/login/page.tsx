'use client';

import LoginForm from '@/components/auth/LoginForm';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/books');
        }
    }, [isAuthenticated, router]);

    const handleLoginSuccess = () => {
        router.push('/books');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex items-center justify-center">
                        <div className="bg-black text-white p-2 rounded-lg mr-3">
                            📚
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Library</h1>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to access your library
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <LoginForm
                        onSuccess={handleLoginSuccess}
                        onToggleMode={() => router.push('/auth/register')}
                    />
                </div>
            </div>
        </div>
    );
}