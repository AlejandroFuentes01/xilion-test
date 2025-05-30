'use client';

import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuthRedirect(redirectTo: string = '/auth/login') {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push(redirectTo);
        }
    }, [isAuthenticated, router, redirectTo]);

    return { isAuthenticated };
}