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
    }, [isAuthenticated, router]);    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="bg-black text-white p-4 rounded-lg inline-block mb-4">
                    📚
                </div>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
        </div>
    );
}