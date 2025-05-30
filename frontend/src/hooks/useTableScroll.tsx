'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseTableScrollOptions {
    hideIndicatorAfterScroll?: boolean;
    scrollThreshold?: number;
    rememberUserPreference?: boolean;
}

interface UseTableScrollReturn {
    scrollRef: React.RefObject<HTMLDivElement | null>;
    showScrollIndicator: boolean;
    hasScrolled: boolean;
    canScrollLeft: boolean;
    canScrollRight: boolean;
    scrollToStart: () => void;
    scrollToEnd: () => void;
    hideIndicator: () => void;
}

export function useTableScroll(options: UseTableScrollOptions = {}): UseTableScrollReturn {
    const {
        hideIndicatorAfterScroll = true,
        scrollThreshold = 10,
        rememberUserPreference = true
    } = options;

    const scrollRef = useRef<HTMLDivElement>(null);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [showScrollIndicator, setShowScrollIndicator] = useState(true);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Función para actualizar estados de scroll
    const updateScrollStates = useCallback(() => {
        const element = scrollRef.current;
        if (!element) return;

        const { scrollLeft, scrollWidth, clientWidth } = element;
        
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);

        // Detectar si ha scrolleado significativamente
        if (scrollLeft > scrollThreshold && !hasScrolled) {
            setHasScrolled(true);
            
            if (hideIndicatorAfterScroll) {
                setShowScrollIndicator(false);
            }

            // Guardar preferencia del usuario
            if (rememberUserPreference) {
                try {
                    localStorage.setItem('table-scroll-tutorial-seen', 'true');
                } catch (error) {
                    // Ignorar errores de localStorage (modo privado, etc.)
                    console.debug('Could not save scroll preference:', error);
                }
            }
        }
    }, [hasScrolled, hideIndicatorAfterScroll, rememberUserPreference, scrollThreshold]);

    // Funciones de scroll programático
    const scrollToStart = useCallback(() => {
        scrollRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
    }, []);

    const scrollToEnd = useCallback(() => {
        const element = scrollRef.current;
        if (element) {
            element.scrollTo({ 
                left: element.scrollWidth - element.clientWidth, 
                behavior: 'smooth' 
            });
        }
    }, []);

    const hideIndicator = useCallback(() => {
        setShowScrollIndicator(false);
        if (rememberUserPreference) {
            try {
                localStorage.setItem('table-scroll-tutorial-seen', 'true');
            } catch (error) {
                console.debug('Could not save scroll preference:', error);
            }
        }
    }, [rememberUserPreference]);

    // Efecto para configurar listeners y verificar preferencias guardadas
    useEffect(() => {
        const element = scrollRef.current;
        if (!element) return;

        // Verificar si el usuario ya vio el tutorial
        if (rememberUserPreference) {
            try {
                const tutorialSeen = localStorage.getItem('table-scroll-tutorial-seen');
                if (tutorialSeen === 'true') {
                    setShowScrollIndicator(false);
                }
            } catch (error) {
                console.debug('Could not read scroll preference:', error);
            }
        }

        // Configurar el observer para detectar si la tabla es scrollable
        const checkScrollable = () => {
            const { scrollWidth, clientWidth } = element;
            const isScrollable = scrollWidth > clientWidth;
            
            if (!isScrollable) {
                setShowScrollIndicator(false);
                setCanScrollRight(false);
                setCanScrollLeft(false);
            } else {
                updateScrollStates();
            }
        };

        // Listener de scroll con throttling
        let scrollTimeout: NodeJS.Timeout;
        const handleScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateScrollStates, 50);
        };

        // Listener de resize para recalcular estados
        let resizeTimeout: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(checkScrollable, 100);
        };

        // Configurar listeners
        element.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });

        // Verificación inicial
        checkScrollable();

        // Cleanup
        return () => {
            element.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            clearTimeout(scrollTimeout);
            clearTimeout(resizeTimeout);
        };
    }, [updateScrollStates, rememberUserPreference]);

    return {
        scrollRef,
        showScrollIndicator,
        hasScrolled,
        canScrollLeft,
        canScrollRight,
        scrollToStart,
        scrollToEnd,
        hideIndicator
    };
}