'use client';

import { useCallback, useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
    hasNextPage: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
    threshold?: number; // Pixels desde el bottom para disparar carga
}

export function useInfiniteScroll({
    hasNextPage,
    isLoading,
    onLoadMore,
    threshold = 200
}: UseInfiniteScrollOptions) {
    const loadingRef = useRef(false);

    const handleScroll = useCallback(() => {
        // Evitar múltiples llamadas simultáneas
        if (loadingRef.current || isLoading || !hasNextPage) {
            return;
        }

        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Calcular si estamos cerca del final
        const isNearBottom = scrollTop + windowHeight >= documentHeight - threshold;

        if (isNearBottom) {
            loadingRef.current = true;
            onLoadMore();

            // Reset flag después de un delay para evitar spam
            setTimeout(() => {
                loadingRef.current = false;
            }, 1000);
        }
    }, [hasNextPage, isLoading, onLoadMore, threshold]);

    useEffect(() => {
        // Throttle scroll events para mejor performance
        let timeoutId: NodeJS.Timeout;

        const throttledHandleScroll = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(handleScroll, 100);
        };

        window.addEventListener('scroll', throttledHandleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', throttledHandleScroll);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [handleScroll]);

    // Reset loading flag cuando cambian las dependencias
    useEffect(() => {
        loadingRef.current = false;
    }, [hasNextPage, isLoading]);
}