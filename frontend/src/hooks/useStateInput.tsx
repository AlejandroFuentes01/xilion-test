'use client';

import { useCallback, useRef } from 'react';

interface UseStableInputOptions {
    onValueChange: (value: string) => void;
    debounceMs?: number;
    fastDebounceMs?: number;
}

export function useStableInput({ 
    onValueChange, 
    debounceMs = 600, 
    fastDebounceMs = 1200 
}: UseStableInputOptions) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastChangeTimeRef = useRef<number>(0);
    const lastValueLengthRef = useRef<number>(0);
    const rapidChangeCountRef = useRef<number>(0);
    
    const handleChange = useCallback((value: string) => {
        const now = Date.now();
        const timeSinceLastChange = now - lastChangeTimeRef.current;
        const newLength = value.length;
        const oldLength = lastValueLengthRef.current;
        
        // Detectar cambios rápidos y borrado
        const isRapidChange = timeSinceLastChange < 100;
        const isDeleting = newLength < oldLength;
        
        // Contar cambios rápidos consecutivos
        if (isRapidChange) {
            rapidChangeCountRef.current++;
        } else {
            rapidChangeCountRef.current = 0;
        }
        
        // Determinar si está en modo "borrado rápido"
        const isRapidDeleting = isDeleting && (isRapidChange || rapidChangeCountRef.current > 2);
        
        lastChangeTimeRef.current = now;
        lastValueLengthRef.current = newLength;
        
        // Limpiar timeout anterior
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        // Usar delay apropiado según el comportamiento detectado
        const delay = isRapidDeleting ? fastDebounceMs : debounceMs;
        
        timeoutRef.current = setTimeout(() => {
            onValueChange(value);
            rapidChangeCountRef.current = 0; // Reiniciar contador
        }, delay);
        
    }, [onValueChange, debounceMs, fastDebounceMs]);
    
    const cleanup = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);
    
    return {
        handleChange,
        cleanup
    };
}