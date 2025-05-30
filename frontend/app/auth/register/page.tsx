'use client';

import RegisterForm from '@/components/auth/RegisterForm';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/books');
        }
    }, [isAuthenticated, router]);

    const handleRegisterSuccess = () => {
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
                        Create your library account
                    </p>
                </div>

                {/* Register Form */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <RegisterForm
                        onSuccess={handleRegisterSuccess}
                        onToggleMode={() => router.push('/auth/login')}
                    />
                </div>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}