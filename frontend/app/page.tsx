'use client';

import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/books');
        } else {
            router.push('/auth/login');
        }
    }, [isAuthenticated, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="bg-black text-white p-4 rounded-lg inline-block mb-4">
                    📚
                </div>
                <h1 className="text-2xl font-bold">Library Management System</h1>
                <p className="text-gray-600 mt-2">Redirecting...</p>
            </div>
        </div>
    );
}